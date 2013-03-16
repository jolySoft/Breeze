
function pause() {
    Write-Host "Press any key to continue ..."
    cmd /c pause | out-null
}


$srcDir = Split-Path -Path $MyInvocation.MyCommand.Definition -Parent
$outFileNm = "breeze.js"
$outMinFileNm = "breeze.min.js"
$outBaseFileNm = "breeze.base.js"
$outMinBaseFileNm = "breeze.base.min.js"

cat _head.frag.js, a??_*.js, _tail.frag.js > _tmp.js
$contents = Get-Content _tmp.js
# writes the file without the BOM ( which cause Uglify to fail if we don't)
[System.IO.File]::WriteAllLines($outBaseFileNm, $contents)
$expr = "uglifyjs " + $outBaseFileNm + " -mt -c -o " + $outMinBaseFileNm  
invoke-expression $expr

cat _head.frag.js, a??_*.js, b??_*.*.js, _tail.frag.js > _tmp.js
$contents = Get-Content _tmp.js
# writes the file without the BOM ( which cause Uglify to fail if we don't)
[System.IO.File]::WriteAllLines($outFileNm, $contents)
$expr = "uglifyjs " + $outFileNm + " -mt -c -o " + $outMinFileNm  
invoke-expression $expr

pause
