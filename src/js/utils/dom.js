/**
 * Execute a function when the DOM is fully loaded.
 * 
 * @param {function} handler 
 */
export const ready = (handler) => {
	if (/complete|loaded|interactive/.test(document.readyState) && document.body) {
		handler();
	} else {
		document.addEventListener('DOMContentLoaded', handler, false);
	}
};