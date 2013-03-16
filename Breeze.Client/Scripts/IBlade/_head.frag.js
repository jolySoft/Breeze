/*
 * Copyright 2012 IdeaBlade, Inc.  All Rights Reserved.  
 * Use, reproduction, distribution, and modification of this code is subject to the terms and 
 * conditions of the IdeaBlade Breeze license, available at http://www.breezejs.com/license
 *
 * Author: Jay Traband
 */

(function (definition) {

    // CommonJS
    if (typeof exports === "object") {
        module.exports = definition();
        // RequireJS
    } else if (typeof define === "function") {
        define(definition);
        // <script>
    } else {
        breeze = definition();
    }

})(function () {         
    var breeze = {
        version: "1.2.2",
    };


    // legacy properties 
    breeze.entityModel = breeze;
    // legacy properties - will not be supported after 3/1/2013
    breeze.entityTracking_backingStore = "backingStore";
    breeze.entityTracking_ko = "ko";
    breeze.entityTracking_backbone = "backbone";
    breeze.remoteAccess_odata = "odata";
    breeze.remoteAccess_webApi = "webApi";
    
//    return breeze;
// }();