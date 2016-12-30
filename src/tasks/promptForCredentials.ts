import * as inquire from 'inquirer';
import {Config} from '../config';

export function promptForCredentials(addonConfig: Config): Promise<any> {
  console.log('Gathering SF credentials');
  let questions = [];
  if (!addonConfig.loginUrl || !addonConfig.noPrompt) {
    questions.push({
      type: 'list',
      name: 'loginUrl',
      message: 'Login URL',
      choices: ['https://test.salesforce.com', 'https://login.salesforce.com'],
      default: addonConfig.loginUrl
    });
  }
  if (!addonConfig.username || !addonConfig.noPrompt) {
    questions.push({
      type: 'input',
      name: 'username',
      message: 'Username',
      default: addonConfig.username
    });
  }
  if (!addonConfig.password || !addonConfig.noPrompt) {
    questions.push({
      type: 'password',
      name: 'password',
      message: 'Password'
    });
  }
  if (questions.length > 0) {
    return inquire.prompt(questions).then((answers: any) => {
      Object.assign(addonConfig, answers);
      return addonConfig as Config;
    });
  } else {
    return Promise.resolve(addonConfig);
  }
}