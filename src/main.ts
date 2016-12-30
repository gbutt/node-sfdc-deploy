import * as tasks from './tasks';
import {Config} from './config';

export function run(options: Config): Promise<boolean> {

    // build addon configuration
    var addonConfig = tasks.buildAddonConfiguration(options);

    return tasks.validateConfig(addonConfig)
    .then(() => tasks.preparePackage(addonConfig))
    .then(()=> {
        if (addonConfig.skipDeploy) {
            return Promise.resolve();
        }
        return tasks.promptForCredentials(addonConfig)
    })
    .then(()=> {
        if (addonConfig.skipDeploy) {
            return Promise.resolve(true);
        }
        return tasks.deployPackageDirectory(addonConfig)
    });
}