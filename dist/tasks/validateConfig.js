"use strict";
var fs = require("fs");
function validateConfig(config) {
    var messages = [];
    if (!config.resourceName) {
        messages.push('resourceName is missing');
    }
    else if (!/^[a-zA-Z]+\w*$/.test(config.resourceName)) {
        messages.push("resourceName \"" + config.resourceName + "\" is invalid. It can only contain alphanumeric characters, must begin with a letter");
    }
    if (!config.deployDir) {
        messages.push('deployDir is missing');
    }
    if (!config.buildDir) {
        messages.push('buildDir is missing');
    }
    else if (!fs.existsSync(config.buildDir)) {
        messages.push("buildDir \"" + config.buildDir + "\" does not exist");
    }
    if (messages.length === 0)
        return Promise.resolve(config);
    return Promise.reject(messages.join(', ') + ".");
}
exports.validateConfig = validateConfig;
