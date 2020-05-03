export const isFunction = unknown => typeof unknown === 'function';
export const isString = unknown => (typeof unknown === 'string' || ((!!unknown && typeof unknown === 'object') && Object.prototype.toString.call(unknown) === '[object String]'));
export const isObject = unknown => ((typeof unknown === 'function' || (typeof unknown === 'object' && !!unknown)) && !Array.isArray(unknown));
// Returns true if the value has a "then" function. Adapted from
// https://github.com/graphql/graphql-js/blob/499a75939f70c4863d44149371d6a99d57ff7c35/src/jsutils/isPromise.js
export const isPromise = value => Boolean(value && typeof value.then === 'function');

export const isNode = unknown => {
	try {
		Node.prototype.cloneNode.call(unknown, false);
		return true;
	} catch (err) {
		return false;
	}
};

/**
 * Convert String (false,False,True,true,no,yes,0,1) to real Boolean
 * @param {String} val 
 */
export const BooleanParse = function (val) {
	const falsy = /^(?:f(?:alse)?|no?|0+)$/i;
	
	return !falsy.test(val) && !!val;
};

/**
 * Check if given query selector is valid
 * @param {String} selector 
 */
export const isSelectorValid = selector => {
	const queryCheck = s => document.createDocumentFragment().querySelector(s)
	try {
		queryCheck(selector);
	} catch {
		return false;
	}
	
	return true;
}