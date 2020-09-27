import { isFunction, isNode, isString } from './type';

/**
 * querySelector under steroid
 * Can use as selector:
 *  - function
 *  - DOM Node
 *  - String
 * @param {String|Node|Function} selector 
 * @param {Node|undefined} node 
 */
export const querySelector = (selector, node) => {
	if (isFunction(selector)) {
		return selector(node);
	}

	if (isNode(selector)) {
		return selector;
	}

	if (isString(selector)) {
		if (!node || !isNode(node) || node.nodeType !== 1) {
			node = document;
		}
		
		return node.querySelector(selector);
	}

	if (Array.isArray(selector) || (typeof NodeList !== 'undefined' && NodeList.prototype.isPrototypeOf(selector))) {
		return selector[0];
	}
}

/** 
 * querySelectorAll under steroid
 * Can use as selector:
 *  - function
 *  - DOM Node
 *  - String
 * @param {String|Node|Function} selector 
 * @param {Node|undefined} node 
 */
export const querySelectorAll = (selector, node) => {
	if (isFunction(selector)) {
		return selector(node);
	}
	
	if (isNode(selector)) {
		return [selector];
	}

	if (isString(selector)) {
		if (!node || !isNode(node) || node.nodeType !== 1) {
			node = document;
		}
		
		return node.querySelectorAll(selector);
	}
	
	if (typeof NodeList !== 'undefined' && NodeList.prototype.isPrototypeOf(selector)) {
		return selector;
	} else {
		return [];
	}
};

// Convert dataset into Object
export const optionsFromDataset = (node, defaultOptions = {}) => {
	if (isNode(node)) {
		return node.dataset ? Object.keys(node.dataset)
			.filter(key => Object.keys(defaultOptions).includes(key))
			.reduce((obj, key) => {
				return {
					...obj,
					[key]: node.dataset[key]
				};
			}, {}) : {};
	} else {
		return {};
	}
};

/**
 * Copy HTML attributes from a source element to a target element
 * @param {Node} target 
 * @param {Node} source 
 * @param {String} except list of attributes to skip (separated by space)
 */
export const cloneAttributes = (target, source, except = null) => {
	if (except !== null) {
		except = except.split(' ');
	}

	[...source.attributes].forEach(attr => {
		if (!except.includes(attr.nodeName)) {
			target.setAttribute(attr.nodeName === "id" ? 'data-id' : attr.nodeName, attr.nodeValue);
		}
	});
};

/**
 * Escapes string for insertion into HTML, replacing special characters with HTML
 * entities.
 * @param {String} string
 */
export const escape = (string) => {
	return isString(string) ?
		string.replace(/(['"<>])/g, (char) => {
			return {
				'<': "&lt;",
				'>': "&gt;",
				'"': "&quot;",
				"'": "&#39;"
			}[char];
		})
	: string;
};
