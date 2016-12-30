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
    return expect(result).to.eventually.be.rejectedWith('invalid config: name is missing, deployDir is missing, outDir is missing.');
  });

  it('should resolve valid config', function(){
    let result = validateConfig(validConfig);
    return expect(result).to.eventually.be.ok;
  });

  it('should reject if name is missing', function(){
    let invalidConfig = Object.assign({}, validConfig, {name: undefined});
    let result = validateConfig(invalidConfig);
    return expect(result).to.eventually.be.rejectedWith('invalid config: name is missing.');
  });

  it('should reject if deployDir is missing', function(){
    let invalidConfig = Object.assign({}, validConfig, {deployDir: undefined});
    let result = validateConfig(invalidConfig);
    return expect(result).to.eventually.be.rejectedWith('invalid config: deployDir is missing.');
  });

  it('should reject if outDir is missing', function(){
    let invalidConfig = Object.assign({}, validConfig, {outDir: undefined});
    let result = validateConfig(invalidConfig);
    return expect(result).to.eventually.be.rejectedWith('invalid config: outDir is missing.');
  });

  it('should reject if outDir does not exist', function(){
    let invalidConfig = Object.assign({}, validConfig, {outDir: 'fakeDir'});
    let result = validateConfig(invalidConfig);
    return expect(result).to.eventually.be.rejectedWith('invalid config: outDir "fakeDir" does not exist.');
  });
});