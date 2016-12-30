"use strict";
var packageBuilder_1 = require("./packageBuilder");
function preparePackage(addonConfig) {
    console.log('Preparing deployment package');
    // create deploy folder
    var pb = new packageBuilder_1.packageBuilder(addonConfig);
    return pb.prepareDeployFolder()
        .then(function () { return Promise.all([
        pb.createMetaXml(),
        pb.createPackageXml(),
        pb.compressResource()
    ]); });
}
exports.preparePackage = preparePackage;
