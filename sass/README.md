
# [![BuildGem](https://cdn.rawgit.com/buildgem/logo/2.1.0/dist/png/buildgem-logo-240x60.png)](https://github.com/buildgem)

A BuildGem plugin to compile CSS from Sass/Scss files.

**This is a beta package. It is not recommended that you use this in production. The API is likely to change before the release of version 1.**


## Installation

```
npm install buildgem-sass 
```


## API

```
var buildgem = require('buildgem')
var sass = require('buildgem-sass')

buildgem()
  .from('./src')
  .to('./build')
  .via([
    sass({
      sources: {
        dir: 'scss',
        match: ['*.scss']
      },
      output: {
        dir: 'static/css',
        ext: 'min.css',
        style: 'compressed',
        map: true
      },
      messages: {
        success: 'CSS compiled'
      }
    })
  ])
  .rebuild()
```

### Options

- ``sources.dir`` (string) Subdirectory that contains the source files for this plugin.
- ``sources.match`` (array) One or more file name patterns that identify the source files.
- ``output.dir`` (string) Subdirectory where the CSS files get saved.
- ``output.ext`` (string) File name extension for built CSS files.
- ``output.style`` (string) Sass output style: "nested", "expanded", "compact", or "compressed".
- ``output.map`` (bool) Enables or disables the outputting of a source map, which aids debugging.
- ``messages.success`` (string) Message to print in the console when the plugin has finished.


<p><br /><br /><br /><br /><a href="http://standardjs.com/"><img src="https://cdn.rawgit.com/feross/standard/master/badge.svg" alt="Standard JS"></a></p>
