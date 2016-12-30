"use strict";
var jsforceMetadataTools = require('jsforce-metadata-tools');
var path = require("path");
function deployPackageDirectory(addonConfig) {
    var deployOpts = {
        allowMissingFiles: true,
        pollInterval: addonConfig.pollInterval,
        pollTimeout: addonConfig.pollTimeout,
        username: addonConfig.username,
        password: addonConfig.password,
        loginUrl: addonConfig.loginUrl
    };
    return jsforceMetadataTools.deployFromDirectory(path.resolve(addonConfig.deployDir, 'src'), deployOpts)
        .then(function (res) {
        console.log('');
        jsforceMetadataTools.reportDeployResult(res, console, addonConfig.verbose);
        return res.success;
    })["catch"](function (err) {
        console.error(err.message);
        return false;
    });
}
exports.deployPackageDirectory = deployPackageDirectory;
