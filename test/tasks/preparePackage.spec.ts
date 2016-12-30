import {expect} from 'chai';
import * as fs from 'fs-extra';
import * as xml2js from 'xml2js';
import * as path from 'path';

import {preparePackage} from '../../src/tasks';
import {packageBuilder} from '../../src/tasks/packageBuilder';
import {Config} from '../../src/config';

describe('preparePackage', function() {

  let testConfig = {
      resourceName: 'testName',
      resourceDescription: 'testDescription',
      deployDir: 'test/tmp/deploy',
      buildDir: 'test/tmp/build',
    } as Config;

  beforeEach(function(){
    fs.removeSync('test/tmp');
    fs.ensureDirSync('test/tmp/build');
    fs.writeFileSync('test/tmp/build/test.txt', 'test');
  });

  after(function(){
    fs.removeSync('test/tmp');
  });

  it('should build package structure', function() {
    let result = preparePackage(testConfig)
    .then(()=>{
      let exists = true;
      exists = exists && fs.existsSync( path.resolve(testConfig.deployDir, 'src/staticresources', 'testName.resource') );
      exists = exists && fs.existsSync( path.resolve(testConfig.deployDir, 'src/staticresources', 'testName.resource-meta.xml') );
      exists = exists && fs.existsSync( path.resolve(testConfig.deployDir, 'src', 'package.xml') );
      return exists;
    });

    return expect(result).to.eventually.be.true;

  });
})