"use strict";
var fs_extra_1 = require("fs-extra");
var path = require("path");
var denodeify = require("denodeify");
var xml2js = require("xml2js");
var zipDir_1 = require("./zipDir");
var readFileP = denodeify(fs_extra_1.readFile);
var writeFileP = denodeify(fs_extra_1.writeFile);
var ensureDirP = denodeify(fs_extra_1.ensureDir);
var parseStringP = denodeify(xml2js.parseString);
var packageBuilder = (function () {
    function packageBuilder(config) {
        this.config = config;
        this.xmlBuilder = new xml2js.Builder({
            xmldec: {
                version: '1.0',
                standalone: undefined,
                encoding: 'UTF-8'
            }
        });
    }
    packageBuilder.prototype.prepareDeployFolder = function () {
        var _this = this;
        return ensureDirP(path.resolve(this.config.deployDir, 'src/staticresources'))
            .then(function () { return _this; });
    };
    packageBuilder.prototype.createMetaXml = function () {
        var metaXml = this.xmlBuilder.buildObject({
            StaticResource: {
                '$': {
                    xmlns: 'http://soap.sforce.com/2006/04/metadata'
                },
                cacheControl: 'Public',
                contentType: 'application/zip',
                description: this.config.resourceDescription
            }
        });
        var writePath = path.resolve(this.config.deployDir, 'src/staticresources', this.config.resourceName + '.resource-meta.xml');
        return writeFileP(writePath, metaXml);
    };
    packageBuilder.prototype.createPackageXml = function () {
        var _this = this;
        return this.getPackageXmlOrDefault()
            .then(function (packageXml) { return _this.mergePackageXml(packageXml); })
            .then(function (packageXml) { return _this.writePackageXml(packageXml); });
    };
    packageBuilder.prototype.compressResource = function () {
        var zipFile = path.resolve(this.config.deployDir, 'src/staticresources', this.config.resourceName + '.resource');
        var srcDir = this.config.buildDir;
        var verbose = this.config.verbose;
        return zipDir_1.zipDir(zipFile, srcDir, verbose);
    };
    packageBuilder.prototype.getPackageXmlOrDefault = function () {
        return readFileP(path.resolve(this.config.deployDir, 'src/package.xml'))
            .then(function (data) {
            if (!data) {
                return exports.defaultPackageXml;
            }
            return parseStringP(data);
        })["catch"](function (err) {
            return exports.defaultPackageXml;
        });
    };
    packageBuilder.prototype.mergePackageXml = function (packageXml) {
        var _this = this;
        var srTypes = packageXml.Package.types.find(function (type) { return type.name[0] === 'StaticResource'; });
        if (!srTypes) {
            packageXml.Package.types.push({
                members: [this.config.resourceName],
                name: ['StaticResource']
            });
        }
        else if (!srTypes.members.find(function (member) { return member === _this.config.resourceName || member === '*'; })) {
            srTypes.members.push(this.config.resourceName);
        }
        return packageXml;
    };
    packageBuilder.prototype.writePackageXml = function (packageXml) {
        var xmlContent = this.xmlBuilder.buildObject(packageXml);
        return writeFileP(path.resolve(this.config.deployDir, 'src/package.xml'), xmlContent);
    };
    return packageBuilder;
}());
exports.packageBuilder = packageBuilder;
exports.defaultPackageXml = {
    Package: {
        '$': {
            xmlns: 'http://soap.sforce.com/2006/04/metadata'
        },
        types: [],
        version: '37.0'
    }
};
