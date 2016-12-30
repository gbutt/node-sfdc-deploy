"use strict";
var program = require("commander");
var colors = require('colors');
var fs = require("fs");
var pkg = require('../package.json');
var main_1 = require("./main");
var cli = (function () {
    function cli() {
    }
    cli.prototype.start = function () {
        program.option('-u, --username [username]', 'Salesforce username')
            .option('-p, --password [password]', 'Salesforce password')
            .option('-l, --login-url [loginUrl]', 'Salesforce login-url')
            .option('-d, --build-dir [buildDir]', 'location of directory to be compressed into a static resource')
            .option('-o, --deploy-dir [deployDir]', 'location of deployment directory')
            .option('-c, --config-file [configFile]', 'location of config json')
            .option('-v, --verbose [verbose]', 'verbose output')
            .option('-s, --no-prompt [noPrompt]', 'Do not prompt for credentials')
            .option('--resource-name [resourceName]', 'Static Resource name')
            .option('--resource-description [resourceDescription]', 'Static Resource description')
            .option('--poll-interval [pollInterval]', 'JSForce poll-interval', parseInt)
            .option('--poll-timeout [pollTimeout]', 'JSForce poll-timeout', parseInt)
            .version(pkg.version)
            .parse(process.argv);
        var config = {
            username: program['username'],
            password: program['password'],
            loginUrl: program['loginUrl'],
            buildDir: program['buildDir'],
            deployDir: program['deployDir'],
            configFile: program['configFile'],
            verbose: program['verbose'],
            noPrompt: program['noPrompt'],
            resourceName: program['resourceName'],
            resourceDescription: program['resourceDescription'],
            pollInterval: program['pollInterval'],
            pollTimeout: program['pollTimeout']
        };
        Object.keys(config).forEach(function (key) {
            if (config[key] === undefined) {
                delete config[key];
            }
        });
        this.cliValidate(config)
            .then(function () { return main_1.run(config); })
            .then(function (success) {
            if (!success) {
                process.exit(1);
            }
            else {
                process.exit(0);
            }
        })["catch"](function (err) {
            console.error(colors.red("ERROR: " + err));
            process.exit(1);
        });
    };
    cli.prototype.cliValidate = function (config) {
        var messages = [];
        var testConfig = Object.assign({}, config);
        if (!!config.configFile) {
            if (!fs.existsSync(config.configFile)) {
                return Promise.reject('configFile does not exist');
            }
        }
        return Promise.resolve();
    };
    return cli;
}());
exports.__esModule = true;
exports["default"] = cli;
