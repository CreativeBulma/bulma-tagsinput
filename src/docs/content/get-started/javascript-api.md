---
title: "Javascript API"
date: "2020-03-21"
menu:
    main:
        parent: 'get-started'
        weight: 3
draft: false
---

# JavaScript API
## Javascript API documentation
BulmaTagsInput is available as a JavaScript object, so you can use it directly.

```javascript
// Instantiate on one element
new BulmaTagsInput(selector, options);

// Instantiate on multiple elements
BulmaTagsInput.attach(selector, options);
```

__Arguments__
* selector: query `String` returning a single `Node` or directly a `Node`
* options: see [Options]({{< ref "/get-started/javascript-api#options" >}}) section

{{< notification info >}}
Main differences between methods are when using `attach`:
* selector can be a query `String` returning a single `Node` or a `NodeList`, directly a `Node` or a `NodeList`
* DOM modifications will be observed to detect any new element responding to the given selector to automatically instantiate BulmaTagsInput on them with the given option.
{{< /notification >}}

### Access to BulmaTagsInput instance
Whatever the way you use to instantiate BulmaTagsInput, all element on which BulmaTagsInput is applied will now contains a new `BulmaTagsInput` function which will let you access to the instance at any time.
```javascript
var inputTags = document.getElementById('input-tags');
new BulmaTagsInput(inputTags);

// Access to the BulmaTagsInput instance
var btiInstance = inputTags.BulmaTagsInput();

// Call BulmaTagsInput method
btiInstance.add('new Tag');
```
___

## Options {#options}
### Customize plugin behavior with options
You can easily manage the component behavior by passing an object of options to the constructor.

Options can be set either through JavaScript or directly on the DOM as dataset of the element.
{{< tabs tabTotal="2" tabID="1" tabName1="1. JavaScript" tabName2="2. Dataset" >}}
{{< tab tabNum="1" >}}
Provide options when instanciating plugin. Options will be applied to all element provided (or found by the given selector).
```javascript
BulmaTagsInput.attach('input[data-type="tags"], input[type="tags"], select[data-type="tags"], select[type="tags"]', {
    allowDuplicates: false,
	caseSensitive: true,
	clearSelectionOnTyping: false,
	closeDropdownOnItemSelect: true,
	delimiter: ',',
	freeInput: true,
	highlightDuplicate: true,
	highlightMatchesString: true,
	itemValue: undefined,
  	itemText: undefined,
	maxTags: undefined,
	maxChars: undefined,
	minChars: 1,
	noResultsLabel: 'No results found',
	placeholder: '',
	removable: true,
	searchMinChars: 1,
	searchOn: 'text',
	selectable: true,
	source: undefined,
	tagClass: 'is-rounded',
	trim: true
});
```
{{< /tab >}}

{{< tab tabNum="2" >}}
Add option directly to the element by using dataset attributes. This way, options can be specific to each element. These declaration will override any default option or option passed by the JavaScript instantiation.
All you have to do is to use the [kebab-case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles) notation of option and declare it as a `data attribute` of the HTML Element.
```html
<input type="tags" data-allow-duplicates="true" data-max-chars="10" data-min-chars="3" data-selectable="false">
```
{{< /tab >}}
{{< /tabs >}}

### Options list
All available option are described in the folowing table:
{{< options >}}

___

# API {#api}
## Interact with the component
{{< api >}}

# Events {#events}
This component provides some events you can listen to to react on state changes.
{{< table source="events" >}}