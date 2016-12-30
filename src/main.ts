import * as tasks from './tasks';
import {Config} from './config';

export function run(options: Config): Promise<boolean> {

    // build addon configuration
    var addonConfig = tasks.buildAddonConfiguration(options);

    return tasks.validateConfig(addonConfig)
    .then(() => tasks.preparePackage(addonConfig))
    .then(()=> tasks.promptForCredentials(addonConfig))
    .then(()=> tasks.deployPackageDirectory(addonConfig));
}