import {ensureDir, writeFile, readFile} from 'fs-extra';
import * as path from 'path';
import * as denodeify from 'denodeify';
import * as xml2js from 'xml2js';

import {Config} from '../config';
import {zipDir} from './zipDir';

let readFileP = denodeify(readFile) as Function;
let writeFileP = denodeify(writeFile) as Function;
let ensureDirP = denodeify(ensureDir);
let parseStringP = denodeify(xml2js.parseString);

export class packageBuilder {

  private xmlBuilder: xml2js.Builder;

  constructor(private config: Config){
    this.xmlBuilder = new xml2js.Builder({
      xmldec: {
        version: '1.0',
        standalone: undefined,
        encoding: 'UTF-8'
      }
    });

  }

  prepareDeployFolder(): Promise<any> {
    return ensureDirP(path.resolve(this.config.deployDir, 'src/staticresources'))
    .then(()=> this);
  }

  createMetaXml(): Promise<any> {
    let metaXml = this.xmlBuilder.buildObject({
      StaticResource: {
        '$': {
          xmlns: 'http://soap.sforce.com/2006/04/metadata'
        },
        cacheControl: 'Public',
        contentType: 'application/zip',
        description: this.config.resourceDescription
      }
    });
    let writePath = path.resolve(this.config.deployDir, 'src/staticresources', this.config.resourceName + '.resource-meta.xml');
    return writeFileP(writePath, metaXml);
  }

  createPackageXml(): Promise<any> {
    return this.getPackageXmlOrDefault()
    .then((packageXml: any) => this.mergePackageXml(packageXml))
    .then((packageXml: any) => this.writePackageXml(packageXml));
  }

  compressResource(): Promise<any> {
    var zipFile = path.resolve(this.config.deployDir, 'src/staticresources', this.config.resourceName + '.resource');
    var srcDir = this.config.buildDir;
    var verbose = this.config.verbose;

    return zipDir(zipFile, srcDir, verbose);
  }

  private getPackageXmlOrDefault(): Promise<any> {
    return readFileP(path.resolve(this.config.deployDir, 'src/package.xml'))
    .then((data: any) => {
      if (!data) {
        return defaultPackageXml;
      }
      return parseStringP(data);
    })
    .catch((err:Error) => {
      return defaultPackageXml;
    });
  }

  private mergePackageXml(packageXml: any): any {
    let srTypes = packageXml.Package.types.find((type: any) => type.name[0] === 'StaticResource');
    if (!srTypes) {
      packageXml.Package.types.push({
        members: [this.config.resourceName],
        name: ['StaticResource']
      });
    } else if (!srTypes.members.find((member: any) => member === this.config.resourceName || member === '*')) {
      srTypes.members.push(this.config.resourceName);
    }
    return packageXml;
  }

  private writePackageXml(packageXml: any): Promise<any> {
    let xmlContent = this.xmlBuilder.buildObject(packageXml);
    return writeFileP(path.resolve(this.config.deployDir, 'src/package.xml'), xmlContent);
  }
}

export const defaultPackageXml = {
  Package: {
    '$': {
      xmlns: 'http://soap.sforce.com/2006/04/metadata'
    },
    types: [] as any[],
    version: '37.0'
  }
};