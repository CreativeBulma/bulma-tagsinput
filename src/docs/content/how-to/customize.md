---
title: "Customize"
date: "2020-03-21"
menu:
    main:
        parent: 'how-to'
        weight: 1
weight: 1
draft: false
---

# How-To
## Customize
This component has been designed to be easily customizable.

There is 2 ways to customize it, depending on the way you integrate this component into your project.

## Sass
If you use the Sass source into your project, all you have to do is to customize variables **before** importing the component.
```sass
$tagsinput-selected-background-color: $dark

@import '@creativebulma/bulma-tagsinput'
```

### Variables
{{< variables >}}

## CSS
If you uses the CSS version you have to customize Sass source files then rebuild the CSS file.

### First, let's install some packages!

```shell
npm install
```
This command will install all development required package.

### Customize
Customize Sass variables defined within `src/sass/index.sass` file. 

### Build
You can build CSS files by launching the build process with the command:
```shell
npm run build
```
Styles are built using `node-sass` from `src/sass` directory and minify them.
Built files will be copied into `/dist` directory (can be customized within package.json).
