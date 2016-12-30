const jsforceMetadataTools = require('jsforce-metadata-tools');
import * as path from 'path';
import {Config} from '../config';


export function deployPackageDirectory(addonConfig: Config) : Promise<boolean> {
  var deployOpts = {
    allowMissingFiles: true,
    pollInterval: addonConfig.pollInterval,
    pollTimeout: addonConfig.pollTimeout,
    username: addonConfig.username,
    password: addonConfig.password,
    loginUrl: addonConfig.loginUrl
  };
  return jsforceMetadataTools.deployFromDirectory(path.resolve(addonConfig.deployDir, 'src'), deployOpts)
    .then(function (res: any) {
      console.log('');
      jsforceMetadataTools.reportDeployResult(res, console, addonConfig.verbose);
      return res.success;
    })
    .catch(function (err: any) {
      console.error(err.message);
      return false;
    });
}