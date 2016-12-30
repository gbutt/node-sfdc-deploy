"use strict";
var archiver = require("archiver");
var fs = require("fs-extra");
function zipDir(zipFile, srcDir, verbose) {
    return new Promise(function (resolve, reject) {
        var output = fs.createWriteStream(zipFile);
        output.on('close', function () {
            if (!!verbose) {
                console.log('contents written to ' + zipFile);
            }
            resolve();
        });
        var archive = archiver('zip');
        archive.on('entry', function (data) {
            if (!!verbose) {
                console.log('adding file ' + data.name);
            }
        });
        archive.on('error', function (err) {
            console.log(err);
            reject(err);
        });
        archive.pipe(output);
        archive.directory(srcDir, '');
        archive.finalize();
    });
}
exports.zipDir = zipDir;
