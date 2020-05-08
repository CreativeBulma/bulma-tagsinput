---
title: "Installation"
date: "2020-03-21"
menu:
    main:
        parent: 'get-started'
        weight: 2
url: /get-started/
weight: 2
draft: false
---

{{% notification warning %}}This component extends Bulma CSS Framework, so you need to have Bulma installed to use it.{{% /notification %}}

## Installation
### First, let's install the component!
There are several ways to get started with BulmaTagsInput.
{{< tabs tabTotal="3" tabID="install" tabName1="1. NPM" tabName2="2. CDN" tabName3="3. Github" >}}
{{< tab tabNum="1" >}}
Use npm to install the `bulma-tagsinput` package **recommended**
```shell
npm install @creativebulma/bulma-tagsinput
```
{{< /tab >}}

{{< tab tabNum="2" >}}
Use the [jsDelivr](https://jsdelivr.com) CDN to link to the BulmaTagsInput stylesheet
```html
https://www.jsdelivr.com/package/npm/@creativebulma/bulma-tagsinput
```
{{< /tab >}}

{{< tab tabNum="3" >}}
Use the GitHub repository to get the latest development version.

Download from the repository [https://github.com/CreativeBulma/bulma-tagsinput/tree/master/dist/](https://github.com/CreativeBulma/bulma-tagsinput/tree/master/dist/)
{{< /tab >}}
{{< /tabs >}}

### Integrate styles
{{< tabs tabTotal="2" tabID="import-style" tabName1="1. Browser" tabName2="2. Sass" >}}
{{< tab tabNum="1" >}}
```html
<link rel="stylesheet" href="https://www.jsdelivr.com/package/npm/@creativebulma/bulma-tagsinput/dist/css/bulma-tagsinput.min.css" />
```
{{< /tab >}}

{{< tab tabNum="2" >}}
Open you application's main sass file and add the following lines:
```sass
// Import Bulma first
@import 'bulma';

// Import BulmaTagsInput main Sass File
@import '@creativebulma/bulma-tagsinput/src/sass/index';
```
{{< /tab >}}
{{< /tabs >}}

### Integrate the JavaScript
{{< tabs tabTotal="2" tabID="import-js" tabName1="1. Browser" tabName2="2. ES6" >}}
{{< tab tabNum="1" >}}
```html
<script src="https://www.jsdelivr.com/package/npm/@creativebulma/bulma-tagsinput/dist/js/bulma-tagsinput.min.js"></script>
```
{{< /tab >}}

{{< tab tabNum="2" >}}
```javascript
import BulmaTagsInput from '@creativebulma/bulma-tagsinput';
```
{{< /tab >}}
{{< /tabs >}}

See [JavaScript API]({{< relref "/get-started/javascript-api" >}}) documentation to find out how to work with the component in Javascript.

## Framework Integration
{{< tabs tabTotal="2" tabID="framework-integration" tabName1="1. ReactJS" tabName2="2. VueJS" >}}
{{< tab tabNum="1" >}}
See our [ReactJS integration](https://codepen.io/CreativeBulma/pen/PoPJVQx) example on CodePen
{{< /tab >}}

{{< tab tabNum="2" >}}
See our [VueJS integration](https://codepen.io/CreativeBulma/pen/pojWGpo) example on CodePen
{{< /tab >}}
{{< /tabs >}}

# You're ready to [use BulmaTagsInput]({{< relref "/get-started/usage" >}}) !