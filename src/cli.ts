import * as program from 'commander';
let colors = require('colors');
import * as fs from 'fs';

let pkg = require('../package.json');
import {run} from './main';
import {Config} from './config';

export default class cli {
  start() {
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

    let config: any = {
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
      pollTimeout: program['pollTimeout'],
    };

    Object.keys(config).forEach((key: string) => {
      if(config[key] === undefined) {
        delete config[key];
      }
    });

    this.cliValidate(config)
    .then(()=> run(config))
    .then(function (success) {
      if (!success) {
        process.exit(1);
      } else {
        process.exit(0);
      }
    })
    .catch(function (err: any) {
      console.error(colors.red(`ERROR: ${err}`));
      process.exit(1);
    });

  }

  cliValidate(config: Config): Promise<any> {
    let messages = [];
    let testConfig = Object.assign({}, config);

    if (!!config.configFile) {
      if (!fs.existsSync(config.configFile)) {
        return Promise.reject('configFile does not exist');
      }
    }

    return Promise.resolve();
  }
}