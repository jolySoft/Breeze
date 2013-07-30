(function (testFns) {
    var breeze = testFns.breeze;
    var core = breeze.core;
    var Event = core.Event;
    
    
    var EntityQuery = breeze.EntityQuery;
    var DataService = breeze.DataService;
    var MetadataStore = breeze.MetadataStore;
    var NamingConvention = breeze.NamingConvention;
    var EntityManager = breeze.EntityManager;
    var EntityKey = breeze.EntityKey;
    var FilterQueryOp = breeze.FilterQueryOp;
    var Predicate = breeze.Predicate;
    var QueryOptions = breeze.QueryOptions;
    var FetchStrategy = breeze.FetchStrategy;
    var MergeStrategy = breeze.MergeStrategy;

    var altServiceName = "breeze/Inheritance";

    var newEm = testFns.newEm;
    var newEmX = testFns.newEmX;

    if (testFns.DEBUG_MONGO) {
        test("Skipping inherit billing tests - DB not yet avail", function () {
            ok(true, "Skipped tests - Mongo");
        });
        return;
    };

    module("inheritBilling", {
        setup: function () {
            testFns.setup({ serviceName: altServiceName } );
        },
        teardown: function () {
        }
    });

    function queryBillingBase(typeName) {
        var em = newEmX();

        var q = EntityQuery.from(typeName + 's')
            .using(em);
        stop();
        var iopType = em.metadataStore.getEntityType(typeName);
        q.execute().then(function (data) {
            var r = data.results;
            ok(r.length > 0, "should have found some " + typeName);
            ok(r.every(function (f) {
                return f.entityType.isSubtypeOf(iopType);
            }));

        }).fail(function (e) {
            ok(false, e.message);
        }).fin(start);

    }

    test("query BillingDetailTPH", function () {
        queryBillingBase("BillingDetailTPH");
    });
    test("query BillingDetailTPT", function () {
        queryBillingBase("BillingDetailTPT");
    });
    test("query BillingDetailTPC", function () {
        queryBillingBase("BillingDetailTPC");
    });


    test("export metadata", function () {
        var em = newEm();
        var ets = em.metadataStore.getEntityTypes();
       
        var exportedMs = em.metadataStore.exportMetadata();
        var em2 = newEm();

        em2.metadataStore.importMetadata(exportedMs);
        var ets2 = em2.metadataStore.getEntityTypes();
        ok(ets.length === ets2.length, "lengths should be the same");
    });


    function queryBillingBaseWithES5(typeName) {
        var em = newEmX();
        em.metadataStore.registerEntityTypeCtor(typeName, models.BillingDetailWithES5());

        var q = EntityQuery.from(typeName + 's')
            .using(em);
        stop();
        var iopType = em.metadataStore.getEntityType(typeName);

        q.execute().then(function (data) {
            var r = data.results;
            ok(r.length > 0, "should have found some " + typeName);
            ok(r.every(function (f) {
                return f.entityType.isSubtypeOf(iopType);
            }), "every item is subtype");
            ok(r.every(function (f) {
                var miscData = f.getProperty("miscData");
                return miscData === "asdf";
            }), "every item has miscData == asdf");
            ok(r.every(function (f) {
                var owner = f.getProperty("owner");
                return owner.length > 1 && owner.toUpperCase() === owner;
            }), "every item has uppercase owner property");
            ok(r.every(function (f) {
                var ido = f.getProperty("idAndOwner");
                var id = f.getProperty("id");
                var owner = f.getProperty("owner");
                return ido.length > 1 && ido == (id + ':' + owner);
            }), "every item has idAndOwner property == id:owner");

        }).fail(function (e) {
            ok(false, e.message);
        }).fin(start);
    }

    test("query BillingDetailTPH - ES5", function () {
        queryBillingBaseWithES5("BillingDetailTPH");
    });
    test("query BillingDetailTPT - ES5", function () {
        queryBillingBaseWithES5("BillingDetailTPT");
    });
    test("query BillingDetailTPC - ES5", function () {
        queryBillingBaseWithES5("BillingDetailTPC");
    });


    test("query BankAccountTPH - ES5", function () {
        queryBillingBaseWithES5("BankAccountTPH");
    });
    test("query BankAccountTPT - ES5", function () {
        queryBillingBaseWithES5("BankAccountTPT");
    });
    test("query BankAccountTPC - ES5", function () {
        queryBillingBaseWithES5("BankAccountTPC");
    });

    //test("query BillingTPT - ES5", function () {
    //    var em = newEmX();

    //    var q = EntityQuery.from("BillingDetailTPTs")
    //        .using(em);
    //    stop();
    //    var iopType = em.metadataStore.getEntityType("BillingDetailTPT");
    //    q.execute().then(function (data) {
    //        var r = data.results;
    //        ok(r.length > 0, "should have found some 'BillingDetailTPT'");
    //        ok(r.every(function (f) {
    //            return f.entityType.isSubtypeOf(iopType);
    //        }));

    //    }).fail(testFns.handleFail).fin(start);
    //});

    var models = {};
    models.BillingDetailWithES5 = function () {

        var ctor;
        if (testFns.modelLibrary == "ko") {
            ctor = function () {

            };
            createBillingDetailES5Props(ctor.prototype);

        } else if (testFns.modelLibrary == "backbone") {
            ctor = Backbone.Model.extend({
                initialize: function (attr, options) {
                    createBillingDetailES5Props(this.attributes);
                }
            });

        } else {
            ctor = function () {

            };
            createBillingDetailES5Props(ctor.prototype);
        }
        return ctor;

    };

    function createBillingDetailES5Props(target) {
        Object.defineProperty(target, "owner", {
            get: function () {
                return this["_owner"] || null;
            },
            set: function (value) {
                this["_owner"] = value.toUpperCase();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(target, "idAndOwner", {
            get: function () {
                return this.id + ":" + this.owner || "";
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(target, "miscData", {
            get: function () {
                return this["_miscData"] || "asdf";
            },
            set: function (value) {
                this["_miscData"] = value;
            },
            enumerable: true,
            configurable: true
        });
    }


})(breezeTestFns);