
# [![BuildGem](https://cdn.rawgit.com/buildgem/logo/2.1.0/dist/png/buildgem-logo-240x60.png)](https://github.com/buildgem)

A BuildGem plugin to compile RSS feeds from simple YAML configuration files.

**This is a beta package. It is not recommended that you use this in production. The API is likely to change before the release of version 1.**


## Installation

```
npm install buildgem-rss 
```


## API

```
var buildgem = require('buildgem')
var rss = require('buildgem-rss')

buildgem()
  .from('./src')
  .to('./build')
  .via([
    rss({
      sources: {
        yaml: {  
          dir: 'rss',
          match: ['**/*.yml', '**/*.yaml']
        }
      },
      messages: {
        success: 'RSS feeds compiled'
      }
    })
  ])
  .rebuild()
```

### Options

- ``sources.yaml.dir`` (string) Subdirectory that contains the source files for this plugin.
- ``sources.yaml.match`` (array) One or more file name patterns that identify the source files.
- ``messages.success`` (string) Message to print in the console when the plugin has finished.


<p><br /><br /><br /><br /><a href="http://standardjs.com/"><img src="https://cdn.rawgit.com/feross/standard/master/badge.svg" alt="Standard JS"></a></p>
