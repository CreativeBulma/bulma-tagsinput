/**
 * @class EventEmitter
 *
 * @property {Array} _listeners
 */
export default class EventEmitter {
	/**
	 * Construct EventEmitter
	 * 
	 * @param {Array} listeners 
	 */
	constructor(listeners = []) {
		this._listeners = new Map(listeners);
		this._events = new Map();
	}

	/**
     * Destroys EventEmitter
     */
    destroy() {
        this._listeners = {};
        this.events = [];
    }

	/**
	 * Count listeners registered for the provided eventName
	 * 
	 * @param {string} eventName 
	 */
	listenerCount(eventName) {
		if (!this._listeners.has(eventName)) {
			return 0;
		}

		return this._listeners.get(eventName).length;
	}

	/**
     * Subscribes on event eventName specified function
	 * 
     * @param {string} eventName
     * @param {function} listener
     */
	on(eventName, listener) {
		this._addListener(eventName, listener, false);
	}

	/**
     * Subscribes on event name specified function to fire only once
	 * 
     * @param {string} eventName
     * @param {function} listener
     */
	once(eventName, listener) {
		this._addListener(eventName, listener, true);
	}

	/**
     * Removes event with specified eventName.
	 * 
     * @param {string} eventName
     */
    off(eventName) {
		this._removeListeners(eventName);
	}

	/**
     * Emits event with specified name and params.
	 * 
     * @param {string} eventName
     * @param eventArgs
     */
    emit(eventName, ...eventArgs) {
        return this._applyEvents(eventName, eventArgs);
	}
	
	/**
	 * Register a new listener
	 * 
	 * @param {string} eventName 
	 * @param {function} listener 
	 * @param {bool} once 
	 */
	_addListener(eventName, listener, once = false) {
		if (Array.isArray(eventName)) {
			eventName.forEach(e => this._addListener(e, listener, once));
		} else {
			eventName = eventName.toString();
			const split = eventName.split(/,|, | /);

			if (split.length > 1) {
				split.forEach(e => this._addListener(e, listener, once));
			} else {
				if (!Array.isArray(this._listeners.get(eventName))) {
					this._listeners.set(eventName, []);
				}

				(this._listeners.get(eventName)).push({
					once: once,
					fn: listener
				});
			}
		}
	}

	/**
	 * 
	 * @param {string|null} eventName 
	 */
	_removeListeners(eventName = null) {
		if (eventName !== null) {
			if (Array.isArray(eventName)) {
				name.forEach(e => this.removeListeners(e));
			} else {
				eventName = eventName.toString();
				const split = eventName.split(/,|, | /);

				if (split.length > 1) {
					split.forEach(e => this.removeListeners(e));
				} else {
					this._listeners.delete(eventName);
				}
			}
		} else {
			this._listeners = new Map();
		}
	}

	/**
     * Applies arguments to specified event
	 * 
     * @param {string} eventName
     * @param {*[]} eventArguments
     * @protected
     */
    _applyEvents(eventName, eventArguments) {
		let result = eventArguments;

        if (this._listeners.has(eventName)) {
			const listeners = this._listeners.get(eventName);
			let removableListeners = [];

			listeners.forEach((listener, index) => {
				if (result = listener.fn.apply(null, eventArguments)) {
					if (listener.once) {
						removableListeners.unshift(index);
					}
				}
			});
	
			removableListeners.forEach(index => {
				listeners.splice(index, 1);
			});

			return result;
		}

		return result[0];
    }
}
