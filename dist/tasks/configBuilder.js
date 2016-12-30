"use strict";
var fs = require("fs");
function buildAddonConfiguration(options) {
    var pkg = JSON.parse(fs.readFileSync('package.json').toString());
    var config = {
        resourceName: pkg.name,
        resourceDescription: pkg.description,
        deployDir: 'deploy'
    };
    if (fs.existsSync('sfdcDeploy.json') && !options.configFile) {
        options.configFile = 'sfdcDeploy.json';
    }
    if (options.configFile) {
        var configFile = JSON.parse(fs.readFileSync(options.configFile).toString());
        Object.assign(config, configFile);
    }
    Object.assign(config, options);
    return config;
}
exports.buildAddonConfiguration = buildAddonConfiguration;
