---
title: "Usage"
date: "2020-03-21"
menu:
    main:
        parent: 'get-started'
        weight: 2
weight: 2
draft: false
---

# Basic usage
To easiest way to start with BulmaTagsInput is to add `data-type="tags"` attribute or set `type="tags"` to an input element and call `BulmaTagsInput.attach();` to convert them all into a Tags input control.

By default Tags input prevent duplicate entries and create selectable and removable tags. These options can be overiden either by JavaScript or by adding options into the input dataset (see [Javascript API](http://10.0.0.6:59626/get-started/javascript-api/) documentation).
{{< preview id="tags-input" lang="html" >}}<div class="field">
	<label class="label">Tags</label>
	<div class="control">
		<input class="input" type="text" data-type="tags" placeholder="Choose Tags" value="One,Two">
	</div>
</div>{{< /preview >}}

BulmaTagsInput works with `select` element as well.

_Notice that if `freeInput` option is set to `true` then you can manually type text to search through available values._
{{< preview  id="tags-input-select" lang="html" >}}<div class="field">
	<label class="label">Tags</label>
	<div class="control">
		<select data-type="tags" data-placeholder="Choose Tags">
			<option value="one" selected>One</option>
			<option value="two">Two</option>
		</select>
	</div>
</div>{{< /preview >}}

Even with a `multiple` select element:
{{< preview id="tags-input-select-multiple" lang="html" >}}<div class="field">
	<label class="label">Tags</label>
	<div class="control">
		<select multiple data-type="tags" data-placeholder="Choose Tags">
			<option value="one" selected>One</option>
			<option value="two" selected>Two</option>
			<option value="three">Three</option>
		</select>
	</div>
</div>{{< /preview >}}

___

## Disabled state
{{< preview  id="tags-input-select-disabled" lang="html" >}}<div class="field">
	<label class="label">Tags</label>
	<div class="control">
		<select data-type="tags" data-placeholder="Choose Tags" disabled>
			<option value="one" selected>One</option>
			<option value="two">Two</option>
		</select>
	</div>
</div>{{< /preview >}}

## Dynamic data source
Work with dynamic data source to automatically retreive data.
Provide an `Array`, a `Function` or a `Promise` into the `source` option to get dynamic data.

The following demo helps you find a country using free [REST Countries API](https://restcountries.eu/#api-endpoints-all).
{{< preview id="tags-input-source" lang="html" >}}<div class="field">
	<label class="label">Tags</label>
	<div class="control">
		<input id="tags-with-source" class="input" type="text" data-item-text="name" data-item-value="numericCode" data-case-sensitive="false" placeholder="Try finding a country name" value="">
	</div>
</div>
<script>
	document.addEventListener('DOMContentLoaded', function() {
		const tagsInput = document.getElementById('tags-with-source');
		new BulmaTagsInput(tagsInput, {
			source: async function(value) {
				// Value equal input value
				// We can then use it to request data from external API
				return await fetch("https://restcountries.eu/rest/v2/name/" + value)
					.then(function(response) {
						return response.json();
					});
		  	}
	  	});
	}, false);
</script>{{< /preview >}}

___

## Do not close dropdown at select
Prevent dropdown to close after selecting an item by setting `closeDropdownOnItemSelect` option to `false`.  _(default value: true)_
{{< preview id="tags-input-select-dont-close" lang="html" >}}<div class="field">
	<label class="label">Tags</label>
	<div class="control">
		<select data-type="tags" data-close-dropdown-on-item-select="false" data-placeholder="Choose Tags">
			<option value="one" selected>One</option>
			<option value="two">Two</option>
		</select>
	</div>
</div>{{< /preview >}}

___

## Remove free input
Remove free input by setting `freeInput` option to `false`.  _(default value: true - automatically set to false on select based element)_
{{< preview id="tags-input-select" lang="html" >}}<div class="field">
	<label class="label">Tags</label>
	<div class="control">
		<input class="input" type="text" data-type="tags" data-free-input="false" placeholder="Choose Tags" value="One,Two">
	</div>
</div>{{< /preview >}}

___

## Allow duplicates tags
Set `allowDuplicates` to `true` to accept duplicate tags.  _(default value: false)_
{{< preview id="tags-input-select-multiple" lang="html" >}}<div class="field">
	<label class="label">Tags</label>
	<div class="control">
		<select multiple data-type="tags" data-allow-duplicates="true" data-placeholder="Choose Tags">
			<option value="one" selected>One</option>
			<option value="two">Two</option>
		</select>
	</div>
</div>{{< /preview >}}

___

## No removable tags
Set `removable` option to `false` to make non removable tags.  _(default value: true)_

Options can be passed through [dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLOrForeignElement/dataset)
{{< preview lang="html" >}}<div class="field">
	<label class="label">Non removable tags</label>
	<div class="control">
		<input class="input" type="text" data-type="tags" data-removable="false" placeholder="Choose Tags" value="One,Two">
	</div>
</div>{{< /preview >}}

___

## No selectable tags
Set `selectable` option to `false` to make non selectable tags.  _(default value: true)_
{{< preview id="non-selectable" lang="html" >}}<div class="field">
	<label class="label">Non selectable tags</label>
	<div class="control">
		<input class="input" type="text" data-type="tags" data-selectable="false" placeholder="Choose Tags" value="One,Two">
	</div>
</div>{{< /preview >}}

___

## Limit number of tags
Set maximum number of tags allowed with the `maxTags` option.  _(default value: undefined)_

Try adding 2 more tags in the following example.
{{< preview id="limit" lang="html" >}}<div class="field">
	<label class="label">Limited number of tags (3)</label>
	<div class="control">
		<input class="input" type="text" data-type="tags" data-max-tags="3" placeholder="Choose Tags" value="One,Two">
	</div>
</div>{{< /preview >}}

___

## Characters limit for tags
Set maximum number of characters allowed for each tags with the `minChars` and `maxChars` option.  _(default value: 1 | undefined)_

Try adding tags with less than 3 characteres or more than 5 characters in the following example.
{{< preview id="limit-characters" lang="html" >}}<div class="field">
	<label class="label">Limited number of characters (3 -> 5)</label>
	<div class="control">
		<input class="input" type="text" data-type="tags" data-min-chars="3" data-max-chars="5" placeholder="Choose Tags" value="One,Two">
	</div>
</div>{{< /preview >}}

___

## Object Tags
Use objects as tags instead of simple string. This makes it possible to set id values in your input field's value, instead of just the tag's text.

{{% notification warning %}}Warning: It is not possible to add tag by typing in this mode (only programmatically or using providing a data source).{{% /notification %}}
{{< preview id="object-tags" lang="html" >}}<div class="field">
	<label class="label">Object tags</label>
	<div class="control">
		<input id="tags" class="input" type="text" data-item-value="value" data-item-text="text" placeholder="Choose Tags" value=''>
	</div>
</div>
<script>
	document.addEventListener('DOMContentLoaded', function() {
      const tags = document.getElementById('tags');
      BulmaTagsInput.attach(tags);
	
		tags.BulmaTagsInput().add([
			{"value": 1,"text": "One"},
			{"value": 2,"text": "Two"}
		]);
	}, false);
</script>

<br />
<div class="field">
	<label class="label">Object tags work well with select element</label>
	<div class="control">
		<select multiple data-type="tags" data-placeholder="Choose Tags">
			<option value="one" selected>One</option>
			<option value="two">Two</option>
		</select>
	</div>
</div>{{< /preview >}}
