/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

const NodeNVData = require('./NodeNVData.js');

module.exports = {
	
	//Service definition example
	controllerService = {
		uuid: '8fe072fc-f211-400c-b540-c95aae700001',
		name: 'mhcontrol',
		methods: ['create', 'delete', 'link', 'set'],
		props: ['modules', 'variables', 'links']
	},

	fieldLogService = {
		uuid: '8fe072fc-f211-400c-b540-c95aae700002',
		name: 'fieldlog',
		methods: ['get'],
		props: ['sampleList']
	},

	labLogService = {
		uuid: '8fe072fc-f211-400c-b540-c95aae700003',
		name: 'lablog',
		methods: ['get'],
		props: ['resultsList']
	},

	mapService = {
		uuid: '8fe072fc-f211-400c-b540-c95aae700004',
		name: 'mapfield',
		methods: ['get'],
		props: ['mapfield']
	},
	
	privateKeys = [
		{
			kty: "EC",
			d: "eEWiWMmT540u44M28QjU03uzzRLRQ0_ixtzc0ztQ3os",
			use: "sig",
			crv: "P-256",
			kid: "DDEebnv1ihLpOyB90qUXnxcEO7NYnIcaCrtHzhzJr7U",
			x: "hj_7IO73w-q5Hp9LTfZWemQbZDSadWBidx8kFTTakXQ",
			y: "exthGwwzjgQyIIa7ZmgWQH62OloYGnCekh-f8bFgG80",
			alg: "ES256"
		},
		{
			kty: "EC",
			d: "rGmfJ-2F61qtY1YICCgpNOmYbW91oye8xLfwbIdtvPo",
			use: "sig",
			crv: "P-256",
			kid: "FTYrbkxa0DojHG5B9MUv9R8Huq1TUCYv8_YTLOU2dcc",
			x: "w7lfpim92nPPGIyNb7viuahjycpHQ2YcL_vWko4cykQ",
			y: "IJVWM43TdVDgQJV4ZwqwzvF5rH0n6UY37ROzoU_M0Jc",
			alg: "ES256"
		}
	],

	async init(privateKeyData) {

		global.host = new HostManager();

		//Note: On node it is necessary to provide the correct webcrypto implementation
		global.crypto = require('crypto').webcrypto;

		global.nvdata = new NodeNVData();

		host.addResourcesManager(new ResourcesManager());

		await host.setupId(privateKeyData);

	}
	
}