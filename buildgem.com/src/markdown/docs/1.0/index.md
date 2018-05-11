---
title: "v1.0 Documentation"
description: API documentation and examples for BuildGem 1.0, a pluggable build automation framework for Node.js
canonical: /docs/1.0/
template: article
status: published
---

BuildGem is a pluggable build automation framework for Node.js.

The build steps are handled entirely by plugins.

BuildGem is inspired by the Node.js static site generators [MetalSmith](https://www.npmjs.com/package/metalsmith), [Wintersmith](https://www.npmjs.com/package/wintersmith) and [Blacksmith](https://www.npmjs.com/package/blacksmith). But BuildGem differs in that it is not limited to building static websites. BuildGem can be used to run any kind of repetitive task: linting, unit testing, transpilation, minification, and more.


## How it works

BuildGem works like this:

* It reads files from a source directory that you specify.
* It passes those files through a series of plugins that you configure.
* Each plugin is given the opportunity to process the source files.
* Plugins send their output to a destination directory that you specify.

Plugins are run synchronously, one after the other. On execution, plugins are given three parameters:

* The path to the source directory.
* The path to the destination build directory.
* A reference to the next plugin in the chain.

```javascript
function plugin (source, destination, next) {}
```

Typically, a plugin will look for specific files in the source directory and use them to do things like compile CSS, aggregate and minify JavaScript modules, and inject content into HTML templates. Each plugin specializes in one area.

When a plugin is finished, it is expected to call the ``next`` plugin in the chain.


## Requirements

* Node.js >= 4.5.0


## Installation

BuildGem and its plugins are shipped separately. Use NPM to install BuildGem and the plugins that you need:

```
npm install buildgem
npm install buildgem-copy
npm install buildgem-md
npm install buildgem-sass
```

Use the ``-g`` flag to install npm modules globally.

You can also use the [Yarn](https://yarnpkg.com/en/) and [JSPM](http://jspm.io/) package managers.


## API

Use Node.js's ``require()`` function to include BuildGem and the plugins.

```javascript
var buildgem = require('buildgem')
var copy = require('buildgem-copy')
var md = require('buildgem-md')
var sass = require('buildgem-sass')
```

If you write your own BuildGem plugins, include them by providing their relative path.

```javascript
var custom = require('./lib/my-custom-plugin.js')
```


### ``new BuildGem()``

The ``buildgem`` module returns an instance of the ``BuildGem`` constructor function. To start a new build, create a new ``BuildGem`` instance:

```javascript
var BuildGem = require('buildgem')

new BuildGem()
```

This works, too:

```javascript
var buildgem = require('buildgem')

buildgem()
```

The constructor function does not take any parameters.


### ``from(path)`` and ``to(path)``

The ``from()`` and ``to()`` methods set the paths to the input and output directories respectively. The defaults are ``"./src"`` and ``"./build"``.


```javascript
var buildgem = require('buildgem')

buildgem()
  .from('./lib')
  .to('./dist')
```


### ``via(plugins)``

The ``via()`` method adds the plugins. It takes a single parameter, an array of plugin functions.

```javascript
var buildgem = require('buildgem')

buildgem()
  .from('./lib')
  .to('./dist')
  .via([
      function (source, destination, next) {
        // ...
        next()
      },
      function (source, destination, next) {
        // ...
        next()
      },
      function (source, destination, next) {
        // ...
        next()
      }
  ])
```

On execution, plugins are given three parameters:

* The path to the source directory.
* The path to the destination build directory.
* A reference to the next plugin in the chain.

When a plugin has done its job, it must execute the ``next`` callback, which triggers execution of the next plugin along.

Typically, BuildGem plugins are constructed by an outer function call that takes an ``options`` object, which configures the plugin. The ``options`` properties vary from one plugin to another. Please refer to each plugin's documentation for details.

```javascript
var buildgem = require('buildgem')
var copy = require('buildgem-copy')
var md = require('buildgem-md')
var sass = require('buildgem-sass')

buildgem()
  .from('./lib')
  .to('./dist')
  .via([
    copy({
      sources: {
        dir: 'verbatim',
        match: ['**/*.*', '**/.*']
      }
    }),
    md({
      sources: {
        markdown: {
          dir: 'markdown',
          match: ['**/*.md', '**/*.markdown']
        },
        templates: {
          dir: 'templates',
          ext: 'html'
        }
      }
    }),
    sass({
      sources: {
        dir: 'scss',
        match: ['*.scss']
      },
      output: {
        dir: 'static/css',
        ext: 'min.css',
        style: 'compressed'
      }
    })
  ])
```


### ``build(done)`` and ``rebuild(done)``

The ``build()`` and ``rebuild()`` methods trigger a fresh build. The difference between these two methods is that ``rebuild()`` will first wipe all of the contents of the build directory, while ``build()`` will not.

```javascript
var buildgem = require('buildgem')

buildgem()
  .from('./lib')
  .to('./dist')
  .via([
    // ...
  ])
  .rebuild()
```

Optionally, the ``build()`` and ``rebuild()`` methods can be given a callback that will be executed when the last plugin has finished. Build callbacks have the following signature: ``fn(err)``. Example:

```javascript
.build(function (err) {
  if (err) throw err;
  console.log('Build complete!');
})
```


### ``listen(done)``

To have the ``build()`` routine automatically re-run whenever a file in the source directory is changed, call the ``listen()`` method on the ``BuildGem`` instance.

```javascript
var buildgem = require('buildgem')

buildgem()
  .from('./lib')
  .to('./dist')
  .via([
    // ...
  ])
  .rebuild()
  .listen()
```

The ``listen()`` method also takes an optional callback that has the same signature as the ``build()`` and ``rebuild()`` callbacks. The callback is run whenever the build is refreshed.

```javascript
.listen(function (err) {
  if (err) throw err;
  console.log('Build updated!');
})
```


## How to write a BuildGem plugin

It is easy to write your own BuildGem plugins. Use this as a template:

```javascript
module.exports = plugin

function plugin (options) {
  options = options || {}

  return function (source, destination, next) {
    // ...

    next()
  }
}
```

Please share your plugins with the community by publishing them to the NPM registry. Please prefix the package name "buildgem-". This will help others discover your plugin.

