export interface Config {
    resourceName?: string;
    resourceDescription?: string;
    verbose?: boolean;
    pollInterval?: number;
    pollTimeout?: number;
    loginUrl?: string;
    username?: string;
    password?: string;
    noPrompt?: boolean;
    configFile?: string;
    deployDir?: string;
    buildDir?: string;
    skipDeploy?: boolean;
}
