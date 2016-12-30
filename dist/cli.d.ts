/// <reference types="core-js" />
import { Config } from './config';
export default class cli {
    start(): void;
    cliValidate(config: Config): Promise<any>;
}
