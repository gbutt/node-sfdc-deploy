import * as fs from 'fs';
import {Config} from '../config';

export function buildAddonConfiguration(options: Config): Config {
  const pkg = JSON.parse(fs.readFileSync('package.json').toString());
  let config = {
    resourceName: pkg.name,
    resourceDescription: pkg.description,
    deployDir: 'deploy'
  } as Config;
  if ((options && options.configFile) || fs.existsSync('sfdcDeploy.json')) {
    var configFile = JSON.parse(fs.readFileSync(options.configFile).toString());
    Object.assign(config, configFile);
  }
  Object.assign(config, options);
  return config;
}