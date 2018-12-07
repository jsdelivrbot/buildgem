
# [![BuildGem](https://cdn.rawgit.com/buildgem/logo/2.1.0/dist/png/buildgem-logo-240x60.png)](https://github.com/buildgem)

A BuildGem plugin to make HTML documents from Markdown files with metadata represented by YAML front-matter.

**This is a beta package. It is not recommended that you use this in production. The API is likely to change before the release of version 1.**


## Installation

```
npm install buildgem-md
```


## API

```
var buildgem = require('buildgem')
var md = require('buildgem-md')

buildgem()
  .from('./src')
  .to('./build')
  .via([
    md({
      sources: {
        markdown: {
          dir: 'markdown',
          match: ['**/*.md', '**/*.markdown']
        },
        templates: {
          dir: 'templates',
          ext: 'html'
        },
        data: {
          app_name: 'BuildGem'
        }
      },
      messages: {
        success: 'HTML files made'
      }
    })
  ])
  .rebuild()
```

### Options

- ``sources.markdown.dir`` (string) Subdirectory that contains the Markdown source files for this plugin.
- ``sources.markdown.match`` (array) One or more file name patterns that identify the Markdown source files.
- ``sources.templates.dir`` (string) Subdirectory that contains the HTML templates.
- ``sources.templates.ext`` (array) File name extension used on the source HTML templates.
- ``data`` (object) Optional global data that is provided to all templates.
- ``messages.success`` (string) Message to print in the console when the plugin has finished.


<p><br /><br /><br /><br /><a href="http://standardjs.com/"><img src="https://cdn.jsdelivr.net/gh/feross/standard/badge.svg" alt="Standard JS"></a></p>
