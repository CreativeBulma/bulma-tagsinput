---
title: "Get Started"
date: "2020-03-21"
menu: "main"
weight: 2
draft: false
---

# Get started
Although {{% link text="Bulma" href="https://bulma.io" target="_blank" %}} is a pure CSS Framework, modern Website and application use JavaScript to provide a friendlier experience. BulmaBoilerplate has been designed with that in mind and provides a clean structured project with modularity.

{{< tabs tabTotal="2" tabID="1" tabName1="NPM" tabName2="Github" >}}
{{< tab tabNum="1" >}}
Use npm to create a new Bulma project based on our boilerplate. **recommended**
```shell
npm install -g create-project
```

Create a new project
```shell
create-project new-project-name @creativebulma/bulma-boilerplate
```
{{< /tab >}}

{{< tab tabNum="2" >}}
Use the GitHub repository to get the latest version.

```shell
git clone https://github.com/CreativeBulma/bulma-boilerplate.git
```
{{< /tab >}}
{{< /tabs >}}

## Development Guide
### First, let's install some packages!
Run the following command from your project folder:
```shell
npm install
```
It will install all required dependencies.

### Step by step guide
This section will guide you into the required steps to develop your own template based on BulmaBoilerplate.

#### 1. Customize package details
Start by editing `package.json` file to customize following properties:
- **name**: Name of your template
- **description**: Short description of your template
- **version**: Version number (using {{% link text="SemVer" href="https://semver.org/" target="_blank" %}})
- **library**: Library name of the JavaScript package
- **script**: Customize the JavaScript dist filename
- **style**: Customize the Stylesheet dist filename
- **author**: Details about the author
- **repository** _(optional)_: Information about the repository storing the project
- **license**: License type
- **bug** _(optional)_: URL where bugs can be reported
- **keywords**: List of keywords relative to your project
- **dependencies**: Dependencies required to use your project
- **devDependencies**: Dependencies required to customize your project

#### 2. Stylesheet
Stylesheets are developped using {{% link text="Sass" href="https://sass-lang.com/" target="_blank" %}} preprocessor and must be stored into `src/sass` directory.\
The sources directory is structured as following:

- **bulma-custom**\
   This directory reproduce the standard Bulma sources structure.\
   All standard Bulma elements/components customization should be done here.
- **theme-sass**\
   This directory contains all Theme specific sources. You can define your own elements, components and layouts.\
   It contains custom Sass functions and mixins.
   - **components**: Develop your custom Theme specific components here.
   - **elements**: Develop your custom Theme specific elements here.
   - **layouts**: Develop your custom Theme specific layouts here.
   - **variables**: This directory contains global variables cusotmization (bulma ones and theme specific ones) that will be used to customize colors and typography. 
   - **_all.sass**: This file is used to include all theme partials.\
      If you define new components, elements, layouts, ..., you'll have to import them in this file to get them includes into your Theme.
   - **_functions.sass**: Define your custom {{% link text="Sass functions" href="https://sass-lang.com/documentation/at-rules/function" target="_blank" %}} here.
   - **_mixins.sass**: Define your custom {{% link text="Sass mixins" href="https://sass-lang.com/documentation/at-rules/mixin" target="_blank" %}} here.
   - **miscellaneous.sass**: Develop here everything that does not fit into one of the previous categories.
- **index.sass**: Main project Sass file used as entry point by building process. Import of any third party Sass library are done here (at the end of the file).
   

#### 3. JavaScript
JavaScript sources must be stored into `src/js` directory.\
You can use ES6 style - building process will use {{% link text="Babel" href="https://babeljs.io/" target="_blank" %}} to transpile the code - to have a modular approach.

### 4. Build
Build process can be launched with the command:
```shell
npm run build
```
This command will run `build:styles` and `build:scripts` processes.

#### build:styles
Styles are built using `node-sass` from `src/sass` directory and minify them.\
Built files will be copied into `/dist/css` directory (can be customized within package.json).

#### build:scripts
Scripts are built using {{% link text="Webpack" href="https://webpack.js.org/" target="_blank" %}} and {{% link text="Babel" href="https://babeljs.io/" target="_blank" %}}.
Sources can be found in `src/js` directory.\
Built files will be copied into `/dist/js` directory (can be customized within package.json). The resulting library will be named based on `library` property from `package.json` file.
