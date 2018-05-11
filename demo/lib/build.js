/*!
 * Build script for testing purposes.
 *
 * Copyright (c) 2017-2018 Kieran Potts
 * MIT License
 */

'use strict'

// Change these paths to point to the relevant repositories on your
// local filesystem:
var buildgem = require('../../buildgem')
var copy = require('../../buildgem-copy')
var md = require('../../buildgem-md')
var sass = require('../../buildgem-sass')

buildgem()
  .from('./src')
  .to('./build')
  .via([
    copy({
      sources: {
        dir: 'verbatim',
        match: ['**/.*', '**/*.*']
      },
      messages: {
        success: 'Static files copied'
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
      },
      messages: {
        success: 'HTML built'
      }
    }),
    sass({
      sources: {
        dir: 'scss',
        match: ['theme/*.scss']
      },
      output: {
        dir: 'static/styles',
        ext: 'min.css',
        style: 'compressed',
        map: true
      },
      messages: {
        success: 'CSS transpiled'
      }
    })
  ])
  .rebuild()
  .listen()
