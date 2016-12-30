/// <reference types="core-js" />
import { Config } from '../config';
export declare class packageBuilder {
    private config;
    private xmlBuilder;
    constructor(config: Config);
    prepareDeployFolder(): Promise<any>;
    createMetaXml(): Promise<any>;
    createPackageXml(): Promise<any>;
    compressResource(): Promise<any>;
    private getPackageXmlOrDefault();
    private mergePackageXml(packageXml);
    private writePackageXml(packageXml);
}
export declare const defaultPackageXml: {
    Package: {
        '$': {
            xmlns: string;
        };
        types: any[];
        version: string;
    };
};
