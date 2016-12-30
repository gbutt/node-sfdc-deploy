# Salesforce Deploy Tool

A simple utility that compresses a project into a static resource and deploys it to Salesforce using [jsforce](https://github.com/jsforce/jsforce).

## Install

```sh
npm install --save-dev sfdc-deploy
```
This will install sfdc-deploy to `node_modules/.bin/sfdc-deploy`.

## Usage

### package.json scripts
Add the following scripts to your package.json:

```
"scripts": {
  ...
  "compile": "<your build command>",
  "predeploy": "npm run compile",
  "deploy": "sfdc-deploy --build-dir <build output directory> --deploy-dir <defaults to deploy>"
  ...
}
```

Now you can run the following command to kick off your deployment:
```sh
npm run deploy
```

### gulp.js

I haven't tested this, but it should work.
```js
var sfdcDeploy = require('sfdc-deploy');

gulp.task('deploy', ['build'], function(){
  return sfdcDeploy.run({
    buildDir: 'build',
    deployDir: 'deploy'
  });
});
```

## Options

```
Usage: sfdcDeploy [options]

  Options:

    -h, --help                                    output usage information
    -u, --username [username]                     Salesforce username
    -p, --password [password]                     Salesforce password
    -l, --login-url [loginUrl]                    Salesforce login-url
    -d, --build-dir [buildDir]                    location of directory to be compressed into a static resource
    -o, --deploy-dir [deployDir]                  location of deployment directory
    -c, --config-file [configFile]                location of config json
    -v, --verbose [verbose]                       verbose output
    -s, --no-prompt [noPrompt]                    Do not prompt for credentials
    --resource-name [resourceName]                Static Resource name (defaults to name in package.json)
    --resource-description [resourceDescription]  Static Resource description (defaults to description in package.json)
    --poll-interval [pollInterval]                JSForce poll-interval
    --poll-timeout [pollTimeout]                  JSForce poll-timeout
    --skip-deploy [skipDeploy]                    creates the static resource, but does not depoy to Salesforce
    -V, --version                                 output the version number
```

## Notes

### Deploy Directory Merge
sfdc-deploy will attempt to merge the static resource into your deploy directory.
Suppose you have a deploy directory that looks like this:

```
deploy
  src
    pages
      myPage.page
    staticresources
      file1.resource
      file1.resource-meta.xml
  package.xml
```
After running the depoy command you will have a deploy directory that looks like this:
```
deploy
  src
    pages
      myPage.page
    staticresources
      file1.resource
      file1.resource-meta.xml
      myPackage.resource
      myPackage.resource-meta.xml
  package.xml
```

This means it is safe to use your Salesforce project directory as your deploy directory.
Note however that the deploy operation will attempt to deploy your entire project, and not just the single static resource.
If you have another means of deploying your static resource then you can always use the `--skip-deploy` flag.
This will create the static resource and skip the deployment steps.

### Config File

sfdc-deploy accepts a config file in json format.
By default it will look for a file called `sfdcDeploy.json`.
However you can always specify another file with the `--config-file` flag.

Example:
```json
{
  "resourceName": "ilovelamp",
  "resourceDescription": "Do you really love the lamp, or are you just saying it because you saw it?",
  "verbose": true,
  "pollInterval": 1000,
  "pollTimeout": 10000,
  "loginUrl": "https://login.salesforce.com",
  "username": "ron.burgundy@channel4news.com",
  "password": "bythebeardofzeus",
  "noPrompt": true,
  "deployDir": "deploy",
  "buildDir": "build",
  "skipDeploy": false
}
```
