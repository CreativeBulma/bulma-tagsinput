---
title: "Create a documentation"
date: "2020-03-21"
menu:
    main:
        parent: 'how-to'
        weight: 3
draft: false
---

# How-To
## Create a Documentation
Documentation is one of the most important part of any project (either it is an OpenSource project or not).

With BulmaBoilerplate, making the documentation site is quite easy. Indeed, BulmaBoilerplate provides a default documentation template and has been set up to let you create a static documentation using {{% link text="Hugo" href="http://gohugo.io" target="_blank" %}}, the powerful static site generator.

***Step by Step***
1. Serve the documentation with a local server by running the command
    ```shell
    npm run doc:serve
    ```
    _This command is a shortcut to `hugo serve --source src/docs --watch` command. It runs the documentation using Hugo with the `watch` option and will also watches for any modification within your project `sass` and `js` sources._
2. Open the given url (looks like `localhost:0000`) in your favorite browser
3. Edit sources within `src/docs` directory
4. See all your modifications live

{{< notification info >}}Please see {{% link text="offical Hugo documentation" href="https://gohugo.io/documentation" target="_blank" %}} to find out how to work with Hugo.{{< /notification >}}


## Build Documentation
Once your documentation is ready you can build it. This process will compile your sources and generate a static website in `/docs` directory.

{{< notification  warning >}}
Before building your documentation, don't forget to update the `baseURL` property in `src/docs/config.toml` configuration file.
{{< /notification >}}

The building process can be launched by running the following command:
```shell
npm run doc:build
```
The documentation is now available within the `/docs` directory.
{{% notification info %}}
You can then publish the content of this directory into your webserver to provide the documentation online.
{{% /notification %}}

## Run Documentation
There is 2 ways to access to the existing documentation:
1. Directly open the file `docs/index.html` within the browser
2. Execute the command (this command will run a local webserver powered by Hugo)
   ```shell
   npm run doc
   ```
