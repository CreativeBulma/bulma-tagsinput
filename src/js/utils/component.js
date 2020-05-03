import EventEmitter from './events';
import { optionsFromDataset, querySelectorAll, querySelector } from './dom';
import uuid from './uuid';

export default class Component extends EventEmitter {
	constructor(element, options = {}, defaultOptions = {}) {
		super();

		this.element = querySelector(element, document);

		// An invalid selector or non-DOM node has been provided.
		if (!this.element) {
			throw new Error(`An invalid selector or non-DOM node has been provided for ${this.constructor.name}.`);
		}

		this.element[this.constructor.name] = this.constructor._interface.bind(this);
		this.element[this.constructor.name].Constructor = this.constructor.name;
		this.id = uuid(this.constructor.name + '-');

		this.options = {
			...defaultOptions,
			...options,
			...optionsFromDataset(this.element, defaultOptions) // Use Element dataset values to override options
		};
	}

	/**
	 * Initiate all DOM element corresponding to selector
	 * @method
	 * @return {Array} Array of all Plugin instances
	 */
	static attach(selector = null, options = {}, node = null) {
		let instances = new Array();

		if (selector !== null) {
			querySelectorAll(selector, node).forEach(element => {
				// Check if plugin has already been instantiated for element
				if (typeof element[this.name] === 'undefined') { // If no then instantiate it and register it in element
					instances.push(new this(element, {
						selector: selector,
						...options
					}));
				} else { // If Yes then return the existing instance
					instances.push(element[this.name]);
				}
			});

			if (typeof window[this.name] === 'undefined') {
				window[this.name] = {
					'observers': []
				};
			}

			if (window[this.name]['observers'] && !window[this.name]['observers'].includes(selector)) {
				this.observeDom(selector, options);

				window[this.name]['observers'].push(selector);
			}
		}

		return instances;
	}

	/**
	 * Observe DOM mutations to automatically initialize plugin on new elements when added to the DOM
	 * 
	 * @param {string} selector 
	 * @param {Object} options 
	 */
	static observeDom(selector, options) {
		const observer = new MutationObserver(mutations => {
			mutations.forEach(mutation => {
				for (let i = 0; i < mutation.addedNodes.length; i++) {
					if (typeof window[this.name] !== 'undefined') {
						this.attach(selector, options, mutation.addedNodes[i]);
					}
				}
			});
		});

		if (typeof document !== 'undefined') {
			observer.observe(document, {
				childList: true,
				subtree: true
			});
		}
	}

	static _interface(name = null, options = {}) {
		if (typeof name === 'string') {
			if (typeof this[name] === 'undefined') {
				throw new TypeError(`No method named "${name}"`);
			}

			return this[name](options);
		}

		return this;
	}
}