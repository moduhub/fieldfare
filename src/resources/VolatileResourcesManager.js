
import {ResourcesManager} from './ResourcesManager';
import {logger} from '../basic/Log';


export class VolatileResourcesManager extends ResourcesManager {

    constructor(enableReport=false) {
        super();

        this.hashmap = new Map;

        if(enableReport) {
            setInterval(() => {
                logger.log('info', "Volatile Resources Manager: " + this.hashmap.size + " resources stored.");
            }, 30000);
        }

    }

    static init() {
        const newInstance = new VolatileResourcesManager;
        ResourcesManager.addInstance(newInstance);
    }

    async storeResource(base64data) {

        const base64hash = await ResourcesManager.generateKeyForData(base64data);

		this.hashmap.set(base64hash, base64data);

		// logger.log('info', "res.store("
		// 	+ base64hash
		// 	+ ", "
		// 	+ base64data
		// 	+ ") >hashmap size: " + this.hashmap.size);

		return base64hash;
	}

	getResource(base64hash) {

		var base64data = this.hashmap.get(base64hash);

        if(base64data === undefined) {
            const error = Error('Resource not found');
            error.name = 'NOT_FOUND_ERROR';
            throw error;
        }

		return base64data;
	}

};
