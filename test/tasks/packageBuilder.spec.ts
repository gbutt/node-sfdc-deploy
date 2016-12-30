import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as xml2js from 'xml2js';
import * as denodeify from 'denodeify';

import {Config} from '../../src/config';
import {packageBuilder} from '../../src/tasks/packageBuilder';

chai.use(chaiAsPromised);

let expect = chai.expect;

let parseStringP = denodeify(xml2js.parseString);

describe('packageBuilder', function() {

  let testConfig = {
    resourceName: 'testName',
    resourceDescription: 'testDescription',
    deployDir: 'test/tmp/deploy',
    buildDir: 'test/tmp/build'
  } as Config;

  beforeEach(function(){
    fs.removeSync('test/tmp');
    fs.ensureDirSync('test/tmp/build');
    fs.writeFileSync('test/tmp/build/test.txt', 'test');
  });

  after(function(){
    fs.removeSync('test/tmp');
  });

  describe('prepareDeployFolder', function() {

    it('should build staticresources folder', function() {
      let result = new packageBuilder(testConfig)
        .prepareDeployFolder()
        .then(()=>{
          return fs.existsSync(path.join( testConfig.deployDir, 'src/staticresources'));
        });
      return expect(result).to.eventually.be.true;
    });
  });

  describe('createMetaXml', function(){

    it('should build meta.xml', function(){
      let pb = new packageBuilder(testConfig);
      let result = pb.prepareDeployFolder()
      .then(()=>pb.createMetaXml())
      .then(()=>{
        let metaXml = fs.readFileSync(path.join( testConfig.deployDir, '/src/staticresources/testName.resource-meta.xml' ));
        return parseStringP(metaXml);
      });

      return expect(result).to.eventually.deep.equal({
        StaticResource: {
          '$': {
            xmlns: 'http://soap.sforce.com/2006/04/metadata'
          },
          cacheControl: [ 'Public' ],
          contentType: [ 'application/zip' ],
          description: [ testConfig.resourceDescription ]
        }
      });
    });
  });

  describe('createPackageXml', function(){

    it('should create new package xml', function(){
      let pb = new packageBuilder(testConfig);
      let result = pb.prepareDeployFolder()
        .then(()=>pb.createPackageXml())
        .then(()=>{
          var packageXml = fs.readFileSync(path.join( testConfig.deployDir, 'src/package.xml' ));
          return parseStringP(packageXml);
        });

      return expect(result).to.eventually.deep.equal({
        Package: {
          '$': {
            xmlns: 'http://soap.sforce.com/2006/04/metadata'
          },
          types: [{
            members: [testConfig.resourceName],
            name: ['StaticResource']
          }],
          version: ['37.0']
        }
      });
    });

    it('should merge package xml', function(){
      let xmlContent = new xml2js.Builder().buildObject({
        Package: {
          types: [{
            members: ['some.resource'],
            name: ['StaticResource']
          },{
            members: ['some.page'],
            name: ['ApexPages']
          }],
          version: ['38.0']
        }
      });
      fs.ensureDirSync( path.resolve( testConfig.deployDir, 'src' ));
      fs.writeFileSync( path.resolve( testConfig.deployDir, 'src/package.xml'), xmlContent );

      let pb = new packageBuilder(testConfig);
      let result = pb.prepareDeployFolder()
        .then(()=>pb.createPackageXml())
        .then(()=>{
          var packageXml = fs.readFileSync(path.join( testConfig.deployDir, 'src/package.xml' ));
          return parseStringP(packageXml);
        });

      return expect(result).to.eventually.deep.equal({
        Package: {
          types: [{
            members: ['some.resource', testConfig.resourceName],
            name: ['StaticResource']
          },{
            members: ['some.page'],
            name: ['ApexPages']
          }],
          version: ['38.0']
        }
      });

    });
  });

  describe('compressResource', function(){

    it('should compress sources into a static resource', function(){
      let pb = new packageBuilder(testConfig);
      let result = pb.prepareDeployFolder()
        .then(()=>pb.compressResource())
        .then(()=>{
          // var packageXml = fs.readFileSync(path.join( testConfig.deployDir, 'src/package.xml' ));
          // return parseStringP(packageXml);
          return fs.existsSync( path.resolve( testConfig.deployDir, 'src/staticresources', testConfig.resourceName + '.resource'));
        });

      expect(result).to.eventually.be.true;

    });
  });


});