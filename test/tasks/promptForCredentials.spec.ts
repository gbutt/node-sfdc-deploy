import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
let bddStdin = require('bdd-stdin');

import {Config} from '../../src/config';
import {promptForCredentials} from '../../src/tasks/promptForCredentials';

chai.use(chaiAsPromised);

let expect = chai.expect;

describe('promptForCredentials', function(){

  it('should not prompt for provided credentials', function(){

    let testConfig = {
      username: 'user',
      password: 'pass',
      loginUrl: 'login',
      noPrompt: true,
    } as Config;

    let result = promptForCredentials(testConfig).then(()=> true).catch((err) => {
      console.log(err);
      return false;
    });

    return expect(result).to.eventually.be.true;
  });

  it('should prompt for username', function(){
    let testConfig = {
      password: 'pass',
      loginUrl: 'login',
      noPrompt: true,
    } as Config;

    bddStdin('promptUsername', '\n');
    let result = promptForCredentials(testConfig);
    return expect(result).to.eventually.satisfy(() => testConfig.username === 'promptUsername');
  });

  it('should prompt for password', function(){
    let testConfig = {
      username: 'user',
      loginUrl: 'login',
      noPrompt: true,
    } as Config;

    bddStdin('prompt', '\n');
    let result = promptForCredentials(testConfig);
    return expect(result).to.eventually.satisfy((data:any) => testConfig.password === 'prompt');
  });

  it('should prompt for test login url', function(){
    let testConfig = {
      username: 'user',
      password: 'pass',
      noPrompt: true,
    } as Config;

    bddStdin('\n');
    let result = promptForCredentials(testConfig);
    return expect(result).to.eventually.satisfy((data:any) => testConfig.loginUrl === 'https://test.salesforce.com');
  });

  it('should prompt for production login url', function(){
    let testConfig = {
      username: 'user',
      password: 'pass',
      noPrompt: true,
    } as Config;

    bddStdin(bddStdin.keys.down, '\n');
    let result = promptForCredentials(testConfig);
    return expect(result).to.eventually.satisfy((data:any) => testConfig.loginUrl === 'https://login.salesforce.com');
  });

  it('should prompt for everything', function(){
    let testConfig = {
    } as Config;

    bddStdin(bddStdin.keys.down, '\n', 'pUser', '\n', 'pPass', '\n');
    let result = promptForCredentials(testConfig);
    return expect(result).to.eventually.satisfy((data:any) => {
      return testConfig.username === 'pUser' &&
             testConfig.password === 'pPass' &&
             testConfig.loginUrl === 'https://login.salesforce.com';
    });
  });

});