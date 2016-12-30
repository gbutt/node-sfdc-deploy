"use strict";
var tasks = require("./tasks");
function run(options) {
    // build addon configuration
    var addonConfig = tasks.buildAddonConfiguration(options);
    return tasks.validateConfig(addonConfig)
        .then(function () { return tasks.preparePackage(addonConfig); })
        .then(function () {
        if (addonConfig.skipDeploy) {
            return Promise.resolve();
        }
        return tasks.promptForCredentials(addonConfig);
    })
        .then(function () {
        if (addonConfig.skipDeploy) {
            return Promise.resolve(true);
        }
        return tasks.deployPackageDirectory(addonConfig);
    });
}
exports.run = run;
