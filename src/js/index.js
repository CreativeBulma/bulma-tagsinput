import EventEmitter from "./utils/events";
import { ready } from './utils/dom';

export default class App extends EventEmitter {
	static version() {
		return '1.0.0';
	}

	/**
	 * Create new App
	 * 
	 * @param {Object} options 
	 */
	constructor(options = {}) {
		super();

		this.options = {
			...options
		};

		// Wait for DOM Ready before initializing application
		ready(() => {
			'use strict';
	  
			this._init();
	  
			this.emit('ready');
		});
	}

	/**
	 * Initialize application
	 */
	_init() {
		// ADD YOUR APPLICATION INITIALIZATION HERE
	}
}