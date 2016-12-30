"use strict";
var fs_1 = require("fs");
function buildAddonConfiguration(options) {
    var pkg = JSON.parse(fs_1.readFileSync('package.json').toString());
    var config = {
        resourceName: pkg.name,
        resourceDescription: pkg.description,
        deployDir: 'deploy'
    };
    if (options && options.configFile) {
        var configFile = JSON.parse(fs_1.readFileSync(options.configFile).toString());
        Object.assign(config, configFile);
    }
    Object.assign(config, options);
    return config;
}
exports.buildAddonConfiguration = buildAddonConfiguration;
