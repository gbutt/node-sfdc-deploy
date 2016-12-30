"use strict";
var tasks = require("./tasks");
function run(options) {
    // build addon configuration
    var addonConfig = tasks.buildAddonConfiguration(options);
    return tasks.validateConfig(addonConfig)
        .then(function () { return tasks.preparePackage(addonConfig); })
        .then(function () { return tasks.promptForCredentials(addonConfig); })
        .then(function () { return tasks.deployPackageDirectory(addonConfig); });
}
exports.run = run;
