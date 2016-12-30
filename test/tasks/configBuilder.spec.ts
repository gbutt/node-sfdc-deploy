import {Config} from '../../src/config';
import { buildAddonConfiguration } from '../../src/tasks/configBuilder';
import {expect} from 'chai';

describe('configBuilder', () => {

    describe('buildAddonConfiguration', () => {

        it('should build default config', () => {
            let config = buildAddonConfiguration(undefined);
            expect(config.resourceName).to.equal('node-sfdc-deploy');
            expect(config.resourceDescription).to.equal('Deploys a project to Salesforce as a static resource');
            expect(config.deployDir).to.eq('deploy');
        });

        it('should merge config file', () => {
            let config = buildAddonConfiguration({configFile: 'test/helpers/sfdcDeploy.json'});
            expect(config.resourceName).to.equal('test');
            expect(config.resourceDescription).to.equal('test description');
            expect(config.deployDir).to.eq('deploy');
        });

        it('should merge options', () => {
            let config = buildAddonConfiguration({resourceName: 'options', configFile: 'test/helpers/sfdcDeploy.json', verbose: true});
            expect(config.resourceName).to.equal('options');
            expect(config.resourceDescription).to.equal('test description');
            expect(config.deployDir).to.eq('deploy');
            expect(config.verbose).to.be.true;
        });

    });
});