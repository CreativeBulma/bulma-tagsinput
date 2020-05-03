import tag from "./templates/tag";

const defaultOptions = {
	allowDuplicates: false,					// Are duplicate tags allowed ?
	caseSensitive: true,					// Is duplicate tags identification case sensitive ?
	clearSelectionOnTyping: false,			// Should selected tag be cleared when typing a new input ?
	closeDropdownOnItemSelect: true,		// Should dropdown be closed once an item has been clicked ?
	delimiter: ',',							// Multiple tags delimiter
	freeInput: true,						// Should user be able to input new tag manually ?
	highlightDuplicate: true,				// Should we temporarly highlight identified duplicate tags ?
	highlightMatchesString: true,			// Should we highlight identified matches strings when searching ?
	itemValue: undefined,					// What is the object property to use as value when we work with Object tags ?
  	itemText: undefined,					// What is the object property to use as text when we work with Object tags ?
	maxTags: undefined,						// Maximum number of tags allowed
	maxChars: undefined,					// Maximum of characters allowed for a single tag
	minChars: 1,							// Minimum of characters before processing a new tag
	noResultsLabel: 'No results found',		// Customize the dropdown placecholer when no results found
	placeholder: '',						// Customize the input placholder
	removable: true,						// Are tags removable ?
	searchMinChars: 1,						// How many characters should we enter before starting dynamic search ?
	searchOn: 'text',						// On what dropdown item data do we search the entered value : 'value' or 'text' ?
	selectable: true,						// Are tags selectable ?
	source: undefined,						// Array/Function/Promise to get external data
	tagClass: 'is-rounded',					// Customize tags style by passing classes - They will be added to the tag element
	trim: true								// Should we trim value before processing them ?
}

export default defaultOptions;
