---
title: Home
description: A pluggable build automation framework for Node.js
canonical: /
template: home
status: published
---

```javascript
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
  .rebuild()
  .listen()
```
