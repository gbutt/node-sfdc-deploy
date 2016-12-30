import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import {Config} from '../../src/config';
import {validateConfig} from '../../src/tasks/validateConfig';

chai.use(chaiAsPromised);

let expect = chai.expect;

describe('validateConfig', function(){

  let validConfig = {
    resourceName: 'name',
    resourceDescription: 'description',
    deployDir: 'deployDir',
    buildDir: 'test/fixtures/outDir'
  } as Config;

  it('should reject invalid config', function(){
    let result = validateConfig({});
    return expect(result).to.eventually.be.rejectedWith('resourceName is missing, deployDir is missing, buildDir is missing.');
  });

  it('should resolve valid config', function(){
    let result = validateConfig(validConfig);
    return expect(result).to.eventually.be.ok;
  });

  it('should reject if name is missing', function(){
    let invalidConfig = Object.assign({}, validConfig, {resourceName: undefined});
    let result = validateConfig(invalidConfig);
    return expect(result).to.eventually.be.rejectedWith('resourceName is missing.');
  });

  it('should reject if deployDir is missing', function(){
    let invalidConfig = Object.assign({}, validConfig, {deployDir: undefined});
    let result = validateConfig(invalidConfig);
    return expect(result).to.eventually.be.rejectedWith('deployDir is missing.');
  });

  it('should reject if buildDir is missing', function(){
    let invalidConfig = Object.assign({}, validConfig, {buildDir: undefined});
    let result = validateConfig(invalidConfig);
    return expect(result).to.eventually.be.rejectedWith('buildDir is missing.');
  });

  it('should reject if buildDir does not exist', function(){
    let invalidConfig = Object.assign({}, validConfig, {buildDir: 'fakeDir'});
    let result = validateConfig(invalidConfig);
    return expect(result).to.eventually.be.rejectedWith('buildDir "fakeDir" does not exist.');
  });
});