import * as archiver from 'archiver';
import * as path from 'path';
import * as fs from 'fs-extra';

export function zipDir(zipFile: string, srcDir: string, verbose: boolean): Promise<any> {
  return new Promise(function (resolve, reject) {
    let output = fs.createWriteStream(zipFile);
    output.on('close', () => {
      if (!!verbose) {
        console.log('contents written to ' + zipFile);
      }
      resolve();
    });

    let archive = archiver('zip');
    archive.on('entry', (data: any) => {
      if (!!verbose) {
        console.log('adding file ' + data.name);
      }
    });
    archive.on('error', (err: any) => {
      console.log(err);
      reject(err);
    })
    archive.pipe(output);
    archive.directory(srcDir, '');
    archive.finalize();
  });
}