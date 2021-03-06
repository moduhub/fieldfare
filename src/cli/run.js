import fs from 'fs';
import arg from 'arg';
import path from 'path';
import {LocalHost} from '../env/LocalHost';
import {ffinit} from '../platforms/node/NodeExports';
import {logger} from '../basic/Log'
import {dashboard} from './dashboard';
import chalk from 'chalk';

var env;

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
    {
        '--dashboard': Boolean,
        '--daemon': Boolean
    },
    {
        argv: rawArgs.slice(2),
    }
    );

    var path = '';

    if(rawArgs[2] && rawArgs[2].search('--')) {
        path = rawArgs[2];
    }

    return {
        path:  path,
        dashboard: args['--dashboard'] || false,
        daemon: args['--daemon'] || false
    };
}

export async function main(args) {

    logger.log('info', "===== System started at " + Date.now());

    const options = parseArgumentsIntoOptions(args);

    try {
        await ffinit.setupLocalHost();
        env = await ffinit.setupEnvironment();
        const envWebports = env.elements.get('webports');
        if(await envWebports.isEmpty()) {
            const bootWebports = await ffinit.getBootWebports();
            for(const webport of bootWebports) {
                try {
                    await LocalHost.connectWebport(webport);
                    break;
                } catch (error) {
                    logger.error("Cannot reach " + webport.address + " at port " + webport.port + ' cause: ' + error);
                }
            }
        }
    } catch (error) {
        logger.error('Fieldfare initialization failed: ' + error);
        process.exit(0);
    }
    if(options.dashboard) {
        try {
            logger.disable();
            dashboard(env);
        } catch (error) {
            logger.error('Failed to start dashboard');
        }
    } else
    if(options.daemon) {
        logger.disable();
    }
    if(options.path !== '') {
        const fullpath = path.join(process.cwd(), options.path);
        try {
            if(fs.existsSync(fullpath)) {
                logger.info("Loading service from path " + fullpath);
                const {setup} = await import(fullpath);
                await setup(env);
            } else {
                throw Error('File not found');
            }
        } catch (error) {
            logger.error(chalk.red("Failed to setup service module at \'" + options.path + '\': ' + error.stack));
            process.exit(1);
        }
    } else {
        logger.log('info', "No service defined, running environment basics only");
    }

}
