import Component from './utils/component';
import { cloneAttributes } from './utils/dom';
import { isString, BooleanParse, isObject, isPromise, isFunction } from './utils/type';
import defaultOptions from './defaultOptions';
import tagTemplate from './templates/tag';
import containerTemplate from './templates/wrapper';
import dropdownItemTemplate from './templates/dropdown-item';

// TODO: add pattern or function to valdiate value before adding

export default class BulmaTagsInput extends Component {
    constructor(element, options = {}) {
        super(element, options, defaultOptions);
        
        // Convert Boolean string options to full Boolean
        this.options.allowDuplicates = BooleanParse(this.options.allowDuplicates);
        this.options.caseSensitive = BooleanParse(this.options.caseSensitive);
        this.options.clearSelectionOnTyping = BooleanParse(this.options.clearSelectionOnTyping);
        this.options.closeDropdownOnItemSelect = BooleanParse(this.options.closeDropdownOnItemSelect);
        this.options.freeInput = BooleanParse(this.options.freeInput);
        this.options.highlightDuplicate = BooleanParse(this.options.highlightDuplicate);
        this.options.highlightMatchesString = BooleanParse(this.options.highlightMatchesString);
        this.options.removable = BooleanParse(this.options.removable);
        this.options.searchOn = this.options.searchOn.toLowerCase();
        this.options.selectable = BooleanParse(this.options.selectable);
        this.options.trim = BooleanParse(this.options.trim);

		//Bind events to current class
		this._onDocumentClick = this._onDocumentClick.bind(this);
		this._onInputChange = this._onInputChange.bind(this);
		this._onInputClick = this._onInputClick.bind(this);
		this._onInputFocusOut = this._onInputFocusOut.bind(this);
        this._onInputFocusIn = this._onInputFocusIn.bind(this);
        this._onInputKeyDown = this._onInputKeyDown.bind(this);
        this._onInputKeyPress = this._onInputKeyPress.bind(this);
        this._onOriginalInputChange = this._onOriginalInputChange.bind(this);
        this._onTagDeleteClick = this._onTagDeleteClick.bind(this);
        this._onTagClick = this._onTagClick.bind(this);
        this._onDropdownItemClick = this._onDropdownItemClick.bind(this);
        
        // Define internal variables
        this.items = [];
        this._selected = -1; // index of selected item

		// Initiate plugin
		this._init();
	}

	/**
	 * Initiate all DOM element corresponding to selector
	 * @method
	 * @return {Array} Array of all Plugin instances
	 */
	static attach(selector = 'input[data-type="tags"], input[type="tags"], select[data-type="tags"], select[type="tags"]', options = {}, container = null) {
		return super.attach(selector, options, container);
	}

	/**
	 * Initiate plugin
	 * @method init
	 * @return {void}
	 */
	_init() {
        // Detect if original input was a Select element
        this._isSelect = (this.element.tagName === 'SELECT');
        this._isMultiple = (this._isSelect && this.element.hasAttribute('multiple'));

        // Detect if we work with Object items or not
        // Object Items is forced when working with select element
        this._objectItems = (typeof this.options.itemValue !== 'undefined') || this._isSelect;
        this.options.itemValue = this.options.itemValue ? this.options.itemValue : (this._isSelect ? 'value' : undefined);
        this.options.itemText = this.options.itemText ? this.options.itemText : (this._isSelect ? 'text' : undefined);
        // If no itemText pass then use itemValue as itemText
        if (typeof this.options.itemText === 'undefined') {
            this.options.itemText = this.options.itemValue;
        }

        // Force freeInput to False if working with object items
        this.options.freeInput = this._objectItems ? false : this.options.freeInput;

        // Init search engine
        this.source = null;
        if (typeof this.options.source !== 'undefined') {
            // Fix searchOn option if wrong
            if (!['value', 'text'].includes(this.options.searchOn)) {
                this.options.searchOn = defaultOptions.searchOn;
            }

            if (isPromise(this.options.source)) {
                this.source = this.options.source;
            } else if (isFunction(this.options.source)) {
                this.source = value => Promise.resolve(this.options.source(value));
            } else if (Array.isArray(this.options.source)) {
                this.source = value => Promise.resolve(this.options.source.filter(i => {
                    const val = (this._objectItems ? i[this.options.itemValue] : i);
        
                    return this.options.caseSensitive ? val.includes(value) : val.toLowerCase().includes(value.toLowerCase());
                }));
            }
        }

        // Determine allowed input modes
        this._manualInputAllowed = !this._isSelect && this.options.freeInput;
        this._filterInputAllowed = this._isSelect || this.source;

        this._build();
    }

    /**
     * Build TagsInput DOM elements
     */
    _build() {
        // Create TagsInput DOM
        const containerFragment = document.createRange().createContextualFragment(containerTemplate({
            emptyTitle: typeof this.options.noResultsLabel !== 'undefined' ? this.options.noResultsLabel : 'No results found',
            placeholder: this.element.placeholder ? this.element.placeholder : this.options.placeholder,
            uuid: this.id
        }));

        this.container = containerFragment.firstElementChild;
        this.input = this.container.querySelector('input');
        this.dropdown = this.container.querySelector(`#${this.id}-list .dropdown-content`);
        this.dropdownEmptyOption = this.dropdown.querySelector('.empty-title');

        // Clone attributes between original and new input
        cloneAttributes(this.input, this.element, 'data-type multiple name type value');

        if (this.element.disabled) {
            this.container.setAttribute('disabled', 'disabled');
            this.options.removable = false;
            this.options.selectable = false;
        }

        // Propagate original input disabled attribute to the container
        if (this.input.getAttribute('disabled') || this.input.classList.contains('is-disabled')) {
            this.container.setAttribute('disabled', 'disabled');
        }

        if (!this._manualInputAllowed) {
            this.container.classList.add(this._filterInputAllowed ? 'is-filter' : 'no-input');
        }

        // Remove dropdown if no source or original input is not a select element
        if (!this._isSelect && typeof this.options.source === 'undefined') {
            this.dropdown.remove();
            this.dropdown = null;
            this.input.setAttribute('list', null);
        }

        // Initialize plugin value from original input value
        if (this._isSelect) {
            Array.from(this.element.options).forEach(option => {
                if (option.selected) {
                    // HTML Option element contains value and text properties
                    // Add it silently to not propagate to the original element
                    this.add(option.value ? option : {
                        value: option.text,
                        text: option.text
                    }, true);
                }

                this._createDropdownItem(option);
            });
        } else {
            // We have on input element
            if (this.element.value.length) {
                this.add(this._objectItems ? JSON.parse(this.element.value) : this.element.value, true);
            }
        }

        this._bindEvents();

        // Insert container right before original input and make original input hidden
        this.element.parentNode.insertBefore(this.container, this.element);

        // Hide original input (type="hidden" only works on select)
        this.element.style.display = 'none';
    }

    /**
     * Bind all events listener
     */
    _bindEvents() {
        // Bind document click event to close dropdown
        document.addEventListener('click', this._onDocumentClick);

        // Bind event handlers to orginal input
        this.element.addEventListener('change', this._onOriginalInputChange);

        // Bind event handlers to internal input
        this.input.addEventListener('input', this._onInputChange);
        this.input.addEventListener('click', this._onInputClick);
        this.input.addEventListener('keydown', this._onInputKeyDown);
        this.input.addEventListener('keypress', this._onInputKeyPress);
        this.input.addEventListener('focusout', this._onInputFocusOut);
        this.input.addEventListener('focusin', this._onInputFocusIn);
    }

    /**
     * Check if caret is at the beginning of the input value
     */
    _caretAtStart() {
		try {
			return this.input.selectionStart === 0 && this.input.selectionEnd === 0;
		} catch(e) {
			return this.input.value === '';
		}
    }

    /**
     * Check value length constraint if option activated
     * @param {string|object} item 
     */
    _checkLength(item) {
        const value = this._objectItems ? item[this.options.itemValue] : item;

        if (!isString(value)) {
            return true;
        }

        return value.length >= this.options.minChars && (typeof this.options.maxChars === 'undefined' || value.length <= this.options.maxChars);
    }

    /**
     * Close dropdown
     */
    _closeDropdown() {
        if (this.dropdown) {
            this.emit('before.dropdown.close', this);

            this.container.classList.remove('is-active');

            this.emit('after.dropdown.close', this);
        }
    }

    /**
     * Create a new dropdown item based on given item data
     * @param {String|Object} item 
     */
    _createDropdownItem(item) {
        if (this.dropdown) {
            // TODO: add possibility to provide template through options
            const dropdownItemFragment = document.createRange().createContextualFragment(dropdownItemTemplate({
                text: item.text,
                value: item.value
            }));
            const dropdownItem = dropdownItemFragment.firstElementChild;

            // Save item data into dataset
            dropdownItem.dataset.value = item.value;
            dropdownItem.dataset.text = item.text;

            dropdownItem.addEventListener('click', this._onDropdownItemClick);

            this.dropdown.append(dropdownItem);
        }
    }

    /**
     * Create a new tag and add it to the DOM
     * @param string value 
     */
    _createTag(item) {
        const tagFragment = document.createRange().createContextualFragment(tagTemplate({
            removable: this.options.removable,
            style: this.options.tagClass,
            text: item.text,
            value: item.value
        }));
        const tag = tagFragment.firstElementChild;

        // Attach tag click event to select it
        tag.addEventListener('click', this._onTagClick);

        if (this.options.removable) {
            // Find delete button and attach click event
            const deleteButton = tag.querySelector('.delete');
            if (deleteButton) {
                deleteButton.addEventListener('click', this._onTagDeleteClick);
            }
        }

        // insert new tag at the end (ie just before input)
        this.container.insertBefore(tag, this.input);
    }

    /**
     * Remove all dropdown items except the empty title
     */
    _emptyDropdown() {
        if (this.dropdown) {
            Array.from(this.dropdown.children).filter(child => !child.classList.contains('empty-title')).forEach(child => {
                child.remove();
            });
        }
    }

    /**
     * Find needle into a string and wrap it with <mark> HTML tag
     * @param {String} string 
     * @param {String} needle 
     */
    _highlightMatchesInString(string, needle) {
        const reg = "(" + needle + ")(?![^<]*>|[^<>]*</)"; // explanation: http://stackoverflow.com/a/18622606/1147859
        const regex = new RegExp(reg, "i");

        // If the regex doesn't match the string just return initial string
        if (!string.match(regex)) {
            return string;
        }

        // Otherwise, get to highlighting
        const matchStartPosition = string.match(regex).index;
        const matchEndPosition = matchStartPosition + string.match(regex)[0].toString().length;
        const originalTextFoundByRegex = string.substring(matchStartPosition, matchEndPosition);
        string = string.replace(regex, `<mark class="is-highlighted">${originalTextFoundByRegex}</mark>`);

        return string;
    }

    /**
     * Open dropdown
     */
    _openDropdown() {
        if (this.dropdown) {
            this.container.classList.add('is-active');
        }
    }

    /**
     * Propagate internal input changes to the original input
     */
    _propagateChange() {
        if (!this._isSelect) {
            // If original element is an input element
            this.element.value = this.value;
        } else {
            // If original element is a select element
            Array.from(this.element.options).forEach(option => {
                option.setAttribute('selected', undefined);
                option.selected = false;
                
                // If option has been added by TagsInput then we remove it
                // Otherwise it is an original option
                if (typeof option.dataset.source !== 'undefined') {
                    option.remove();
                }
            });
            
            // Update original element options selected attributes
            this.items.forEach(item => {
                this._updateSelectOptions({
                    value: this._objectItems ? item[this.options.itemValue] : item,
                    text: this._objectItems ? item[this.options.itemText] : item
                });
            });
        }
        
        // Trigger Change event manually (because original input is now hidden)
        // Trick: Passes current class constructor name to prevent loop with _onOriginalInputChange handler)
        const changeEvent = new CustomEvent('change', {
            'detail': this.constructor.name
        });
        this.element.dispatchEvent(changeEvent);
    }

    /**
     * Trim value if option activated
     * @param {string|object} item 
     */
    _trim(item) {
        if (this.options.trim) {
            if (this._objectItems) {
                if (isString(item[this.options.itemValue])) {
                    item[this.options.itemValue] = item[this.options.itemValue].trim();
                }

                if (isString(item[this.options.itemText])) {
                    item[this.options.itemText] = item[this.options.itemText].trim();
                }
            } else {
                item = item.trim();
            }
        }

        return item;
    }

    /**
     * Filter Dropdown items to be compliant with already selected items and current input value
     * Filtering is made on Text by default (can be changed with option)
     */
    _filterDropdownItems(value = null) {
        if (this.dropdown) {
            if (this.emit('before.dropdown.filter', this)) {
                Array.from(this.dropdown.children).filter(child => !child.classList.contains('empty-title')).forEach(child => {
                    const childValue = child.dataset[this.options.searchOn];

                    // Remove highlights
                    if (this.options.highlightMatchesString) {
                        child.textContent = child.textContent.replace(/<\/?(mark\s?(class="is\-highlighted")?)?>]*>?/gm, '');
                    }

                    // If value is found in dropdown
                    if ((value && value.length)) {
                        if (this.options.caseSensitive) {
                            child.style.display = childValue.includes(value) ? 'block' : 'none';
                        } else {
                            child.style.display = childValue.toLowerCase().includes(value.toLowerCase()) ? 'block' : 'none';
                        }

                        if (this.options.highlightMatchesString) {
                            child.innerHTML = this._highlightMatchesInString(child.innerHTML, value);
                        }
                    } else {
                        child.style.display = 'block';
                    }

                    if (!this.options.allowDuplicates || (this._isSelect && !this._isMultiple)) {
                        const hasValue = this.options.searchOn === 'value' ? this.hasValue(childValue) : this.hasText(childValue);

                        child.style.display = hasValue ? 'none' : child.style.display;
                    }
                });

                const hasActiveItems = Array.from(this.dropdown.children).filter(child => !child.classList.contains('empty-title')).some(child => child.style.display !== 'none');
                if (hasActiveItems) {
                    this.dropdownEmptyOption.style.display = 'none';
                } else {
                    this.dropdownEmptyOption.style.display = 'block';
                }

                this.emit('after.dropdown.filter', this);

                return hasActiveItems;
            }
        }

        return true;
    }

    /**
     * Update original select option based on given item
     * @param {String|Object} item 
     */
    _updateSelectOptions(item) {
        if (this._isSelect) {
            // Check to see if the tag exists in its raw or uri-encoded form
            let option = this.element.querySelector(`option[value="${encodeURIComponent(item.value)}"]`) || this.element.querySelector(`option[value="${item.value}"]`);

            // add <option /> if item represents a value not present in one of the <select />'s options
            if (!option) {
                const optionFragment = document.createRange().createContextualFragment(`<option value="${item.value}" data-source="${this.id}" selected>${item.text}</option>`);
                option = optionFragment.firstElementChild;
            
                this.element.add(option);
            }

            // mark option as selected
            option.setAttribute('selected', 'selected');
            option.selected = true;
        }
    }

    /**
     * Add given item
     * item = 'john'
     * item = 'john,jane'
     * item = ['john', 'jane']
     * item = [{
     *  "value": "1",
     *  "text": "John"
     * }, {
     *  "value": "2",
     *  "text": "Jane"
     * }]
     * @param {String|Object} item 
     * @param {Boolean} silently Should the change be propagated to the original element
     */
    add(items, silently = false) {
        // Check if number of items is limited ans reached
        if (typeof this.options.maxTags !== 'undefined' && this.items.length >= this.options.maxTags) {
            return this;
        }

        // Make sure to work with an array of items
        items = Array.isArray(items) ? items : isObject(items) ? [items] : items.split(this.options.delimiter);

        // If string items are expected then check every item is a string
        if (!this._objectItems && (items.filter(item => isString(item)).length !== items.length)) {
            throw('Item must be a string or an array of strings');
        }

        // If object items are expected then check every item is an object
        if (this._objectItems && (items.filter(item => isObject(item)).length !== items.length)) {
            throw('Item must be an object or an array of objects');
        }

        items.forEach(item => {
            item = this._trim(item);

            // Check if item respects min/max chars
            if (this._checkLength(item)) {

                // If original input is a non multiple select element
                if (this._isSelect && !this._isMultiple && this.items.length > 0) {
                    this.removeAtIndex(0);
                    this.element.remove(this.element.selectedIndex);
                }

                // check if duplicates are allowed or not
                if (item = this.emit('before.add', item)) {
                    if (this.options.allowDuplicates || !this.has(item)) {
                        const itemData = {
                            value: this._objectItems ? item[this.options.itemValue] : item,
                            text: this._objectItems ? item[this.options.itemText] : item
                        };

                        const tag = this._createTag(itemData);
                
                        // save item into the internal array
                        this.items.push(item);

                        if (!silently) { 
                            // Propagate change event to the original input
                            this._propagateChange();

                            this.emit('after.add', {
                                item,
                                tag
                            });
                        }
                    } else {
                        if (this.options.highlightDuplicate) {
                            const duplicateTag = Array.from(this.container.children).filter(child => child.classList.contains('tag'))[this.indexOf(item)];

                            if (duplicateTag) {
                                duplicateTag.classList.add('is-duplicate');
                                setTimeout(() => {
                                    duplicateTag.classList.remove('is-duplicate');
                                }, 1250);
                            }
                        }

                        this.emit('item.duplicate', item);
                    }
                }
            }
        });

        return this;
    }

    /**
     * Unselect the selected item
     */
    clearSelection() {
        if (this._selected >= 0) {
            const item = this.items[this._selected];
            const tag = Array.from(this.container.children).filter(child => child.classList.contains('tag'))[this._selected];

            if (this.emit('before.unselect', {
                item,
                tag
            })) {
                if (tag) {
                    tag.classList.remove('is-selected');
                }

                this._selected = -1;

                this.emit('after.unselect', {
                    item,
                    tag
                });
            }
        }

        return this;
    }

    /**
     * Shortcut to removeAll method
     */
    flush() {
        return this.removeAll();
    }

    /**
     * Sets focus on the input
     */
    focus() {
        this.container.classList.add('is-focused');
        this.input.focus();

        return this;
    }

    /**
     * Check if given item is present
     * @param {String} item 
     */
    has(item) {
        item = this._trim(item);

        if (this._objectItems) {
            return this.items.some(i => this.options.caseSensitive || !isString(i[this.options.itemValue]) ? i[this.options.itemValue] === item[this.options.itemValue] : i[this.options.itemValue].toLowerCase() === item[this.options.itemValue].toLowerCase());
        } else {
            return this.hasValue(item);
        }
    }

    /**
     * Check if given text is present
     * @param {String} value 
     */
    hasText(value) {
        if (this.options.trim) {
            value = value.trim();
        }

        return this.items.some(i => {
            const val = (this._objectItems ? i[this.options.itemText] : i);

            return this.options.caseSensitive ? val === value : val.toLowerCase() === value.toLowerCase();
        });
    }

    /**
     * Check if given value is present
     * @param {String} value 
     */
    hasValue(value) {
        if (this.options.trim) {
            value = value.trim();
        }

        return this.items.some(i => {
            const val = (this._objectItems ? i[this.options.itemValue] : i);

            return this.options.caseSensitive ? val === value : val.toLowerCase() === value.toLowerCase();
        });
    } 

    /**
     * Get index of given item
     * @param {string} item 
     */
    indexOf(item) {
        item = this._trim(item);

        if (this._objectItems) {
            if (!isObject(item)) {
                throw('Item must be an object');
            }

            return this.items.map(function(e) { return e.value; }).indexOf(item.value);
        } else {
            return this.items.indexOf(item);
        }
    }

    /**
     * Returns the internal input element
     */
    input() {
        return this.input;
    }

    /**
     * Get items
     */
    items() {
        return this.items;
    }

    /**
     * Remove given item
     * item = 'john'
     * item = 'john,jane'
     * @param String item 
     */
    remove(items) {
        if (this.options.removable) {
            // Make sure to work with an array of items
            items = Array.isArray(items) ? items : isObject(items) ? [items] : items.split(this.options.delimiter);

            // If string items are expected then check every item is a string
            if (!this._objectItems && (items.filter(item => isString(item)).length !== items.length)) {
                throw('Item must be a string or an array of strings');
            }
            // If object items are expected then check every item is an object
            if (this._objectItems && (items.filter(item => isObject(item)).length !== items.length)) {
                throw('Item must be an object or an array of objects');
            }

            items.forEach(item => {
                let index = this.indexOf(item);

                while (index >= 0) {
                    this.removeAtIndex(index);

                    index = this.indexOf(item);
                }
            });
        }

        return this;
    }

    /**
     * Remove all tags at once
     */
    removeAll() {
        if (this.options.removable) {
            if (this.emit('before.flush', this.items)) {
                this.clearSelection();

                Array.from(this.container.children).filter(child => child.classList.contains('tag')).forEach(tag => tag.remove());

                this.items = [];

                this._filterDropdownItems();

                this._propagateChange();

                this.emit('after.flush', this.items);
            }
        }

        return this;
    }

    /**
     * Remove item at given index
     * @param Integer index 
     */
    removeAtIndex(index, clearSelection = true) {
        if (this.options.removable && !isNaN(index) && index >= 0 && index < this.items.length) {
            const tag = Array.from(this.container.children).filter(child => child.classList.contains('tag'))[index];
            const item = this.items[index];

            if (this.emit('before.remove', item)) {
                if (clearSelection) {
                    this.clearSelection();
                }

                if (tag) {
                    tag.remove();
                }

                // If original input is a select element
                // then deselect related option
                if (this._isSelect) {
                    this.element.options[index].selected = false;
                }

                if (this._selected == index) {
                    this._selected = -1;
                } else if (this._selected >= 0) {
                    // One item less so selected index is 
                    this._selected -= 1;
                }

                this.items.splice(index, 1);

                this._filterDropdownItems();

                this._propagateChange();

                this.emit('after.remove', item);
            }
        }

        return this;
    }

    /**
     * Select given item
     * @param {string} item 
     */
    select(items) {
        if (this.options.selectable) {
            // Make sure to work with an array of items
            items = Array.isArray(items) ? items : isObject(items) ? [items] : items.split(this.options.delimiter);

            // If string items are expected then check every item is a string
            if (!this._objectItems && (items.filter(item => isString(item)).length !== items.length)) {
                throw('Item must be a string or an array of strings');
            }
            // If object items are expected then check every item is an object
            if (this._objectItems && (items.filter(item => isObject(item)).length !== items.length)) {
                throw('Item must be an object or an array of objects');
            }

            items.forEach(item => {
                this.selectAtIndex(this.indexOf(item));
            });
        }

        return this;
    }

    /**
     * Select tag at given index
     * @param Integer index 
     */
    selectAtIndex(index) {
        if (this.options.selectable) {
            // Clear selection
            this.clearSelection();

            if (!isNaN(index) && index >= 0 && index < this.items.length) {
                const tag = Array.from(this.container.children).filter(child => child.classList.contains('tag'))[index];
                const item = this.items[index];

                if (this.emit('before.select', {
                    item,
                    tag
                })) {
                    if (tag) {
                        tag.classList.add('is-selected');
                    }

                    this._selected = index;

                    this.emit('after.select', {
                        item,
                        tag
                    });
                }
            }
        }

        return this;
    }

    /**
     * Get selected item
     */
    get selected() {
        if (this._selected >= 0) {
            return this.items[this._selected];
        } else {
            return null;
        }
    }

    /**
     * Get selected item index
     */
    get selectedIndex() {
        return this._selected;
    }

    /**
     * Get value
     */
    get value() {
        if (!this._isSelect) {
            if (this._objectItems) {
                return this.items.map(item => item.value).join(this.options.delimiter);
            } else {
                return this.items.join(this.options.delimiter);
            }
        } else {
            return Array.from(this.element.options).filter(option => option.selected).map(option => option.value);
        }
    }

    /**
     * Set value
     */
    set value(string) {
        this.removeAll();
        this.add(string);
    }

    /**
     * Document click event handler
     * @param {Event} e 
     */
    _onDocumentClick(e) {
        if (this.dropdown) {
            // If we click on element inside container then do nothing
            if (this.container.contains(e.target)) {
                return;
            }

            // Tag and delete button already deleted when event triggered
            // So we check if target is a tag delete button
            if (e.target.dataset.tag && e.target.dataset.tag === 'delete') {
                return;
            }

            // Click outside dropdown so close it
            this._closeDropdown();
        }
    }

    /**
     * Input focus lost event handler
     * @param {Event} e 
     */
    _onDropdownItemClick(e) {
        e.preventDefault();
        
        if (this.dropdown) {
            if (this._objectItems) {
                let item = {};
                item[this.options.itemText] = e.currentTarget.dataset.text;
                item[this.options.itemValue] = e.currentTarget.dataset.value;

                this.add(item);
            } else {
                this.add(e.currentTarget.dataset.value);
            }

            this._filterDropdownItems();
            this.input.value = '';
            this.input.focus();

            if (this.options.closeDropdownOnItemSelect) {
                this._closeDropdown();
            }
        }
    }

    /**
     * Input change event handler
     * @param {Event} e 
     */
    _onInputChange(e) {
        this._filterDropdownItems(this.input.value);
    }

    /**
     * Input click event handler
     * @param {Event} e 
     */
    _onInputClick(e) {
        e.preventDefault();

        if (!this.source || this.input.value.length >= this.options.searchMinChars) {
            this._openDropdown();
            this._filterDropdownItems();
        }
    }

    /**
     * Input focus event handler
     * 
     * @param {Event} e 
     */
    _onInputFocusIn(e) {
        e.preventDefault();
        
        if (this.container.getAttribute('disabled') !== null || this.container.classList.contains('is-disabled')) {
            this.input.blur();
            
            return false;
        }

        this.container.classList.add('is-focused');
    }

    /**
     * Input focus lost event handler
     * @param {Event} e 
     */
    _onInputFocusOut(e) {
        e.preventDefault();

        this.container.classList.remove('is-focused');
    }
    
    /**
     * Input Keydown event handler
     * 
     * @param {Event} e 
     */
    _onInputKeyDown(e) {
        const key = e.charCode || e.keyCode || e.which;

        switch (key) {
            // BACKSPACE
            case 8:
                if (this.options.removable) {
                    if (this._caretAtStart() && this._selected >= 0) {
                        const currentItemIndex = this._selected;
                        // If tag was selected then select next (or previous if next does not exists)
                        if (currentItemIndex >= 0) {
                            this.selectAtIndex(currentItemIndex + 1 < this.items.length ? currentItemIndex + 1 : currentItemIndex - 1);
                        }

                        this.removeAtIndex(currentItemIndex, false);
                    }
                }
                
                if (this.source && (this.input.value.length) < this.options.searchMinChars) {
                    this._closeDropdown();
                }
                break;
            // ESCAPE
            case 27:
                if (this._selected >= 0) {
                    this.clearSelection();
                }

                this._closeDropdown();
                break;
            // DELETE
            case 46:
                if (this.options.removable) {
                    if (this._caretAtStart() && this._selected >= 0) {
                        const currentItemIndex = this._selected;

                        // If tag was selected then select next (or previous if next does not exists)
                        if (currentItemIndex >= 0) {
                            this.selectAtIndex(currentItemIndex + 1 < this.items.length ? currentItemIndex + 1 : currentItemIndex - 1);
                        }
                        
                        this.removeAtIndex(currentItemIndex, false);
                    }
                }

                if (this.source && (this.input.value.length) < this.options.searchMinChars) {
                    this._closeDropdown();
                }
                break;
            // LEFT ARROW
            case 37:
                if (!this.input.value.length) {
                    if (this._selected < 0) {
                        this.selectAtIndex(this.items.length - 1);
                    } else {
                        this.selectAtIndex(this._selected - 1 >= 0 ? this._selected - 1 : this.items.length - 1);
                    }
                }
                break;
            // RIGHT ARROW
            case 39:
                if (!this.input.value.length) {
                    if (this._selected < 0) {
                        this.selectAtIndex(0);
                    } else {
                        this.selectAtIndex(this._selected + 1 >= this.items.length ? 0 : this._selected + 1);
                    }
                }
                break;
            default:
                if (this.options.clearSelectionOnTyping) {
                    this.clearSelection();
                }
                // ignore
        }
    }
    
    /**
     * Input Keypress event handler
     * 
     * @param {Event} e 
     */
    _onInputKeyPress(e) {
        const key = e.charCode || e.keyCode || e.which;
        let value = this._trim(this.input.value) + String.fromCharCode(key);

        if (!this._manualInputAllowed && !this._filterInputAllowed) {
            e.preventDefault();

            return false;
        }

        // ENTER
        if (!value.length && key !== 13) {
            return false;
        }

        if (this._filterInputAllowed) {
            this._filterDropdownItems(value);
        }

        if (this._filterInputAllowed && this.source && value.length >= this.options.searchMinChars && key !== 13) {
            this._openDropdown();
            this.dropdown.classList.add('is-loading');
            this._emptyDropdown();

            this.source(value).then(results => {
                results = this.emit('on.results.received', results);
        
                if (results.length) {
                    results.forEach(result => {
                        let item = {
                            value: null,
                            text: null
                        };

                        if (!isObject(result)) {
                            item.value = result;
                            item.text = result;
                        } else {
                            item.value = result[this.options.itemValue];
                            item.text = result[this.options.itemText];
                        }

                        this._createDropdownItem(item);
                    });
                }

                this._filterDropdownItems(value);

                this.dropdown.classList.remove('is-loading');
            });
        }

        if (this._manualInputAllowed && (value.includes(this.options.delimiter) || key == 13)) {
            // Prevent default behavior (ie: add char into input value)
            e.preventDefault();

            // Split value by delimiter in case we copy/paste multiple values
            const values = value.split(this.options.delimiter);
            values.forEach(value => {
                // check if empty text when delimiter is removed
                if ((value = value.replace(this.options.delimiter, '')) != '') {
                    // push to array and remove delimiter
                    this.add(value);
                }
            });

            value = '';
            // clear input
            this.input.value = '';

            this._closeDropdown();

            return false;
        }
    }

    /**
     * Original input change event handler
     * CAUTION: because original input is now hidden the change event must be triggered manually on change
     * Example how to trigger change event manually
     * var changeEvent = new Event('change');
     * input.dispatchEvent(changeEvent);
     * 
     * @param {Event} e 
     */
    _onOriginalInputChange(e) {
        if (!e.detail || isString(e.detail) && e.detail !== this.constructor.name) {
            this.value = e.currentTarget.value;
        }
    }
    
    /**
     * Tag click event handler
     * 
     * @param {Event} e 
     */
    _onTagClick(e) {
        e.preventDefault();
        
        if (e.currentTarget.classList.contains('delete')) {
            return false;
        }

        if (this.container.getAttribute('disabled') !== null || this.container.classList.contains('is-disabled')) {
            return false;
        }

        this.input.focus();

        if (this.options.selectable) {
            const tag = e.currentTarget.closest('.tag');

            if (tag) {
                const tagIndex = Array.from(this.container.children).indexOf(tag);
                if (tagIndex === this._selected) {
                    this.clearSelection();
                } else {
                    this.selectAtIndex(tagIndex);
                }
            }
        }
    }

    /**
     * Delete tag button click event handler
     * 
     * @param {Event} e 
     */
    _onTagDeleteClick(e) {
		e.preventDefault();

        if (this.container.getAttribute('disabled') !== null || this.container.classList.contains('is-disabled')) {
            return false;
        }
        
        const tag = e.currentTarget.closest('.tag');

        if (tag) {
            this.removeAtIndex(Array.from(this.container.children).indexOf(tag));
        }
    }
}