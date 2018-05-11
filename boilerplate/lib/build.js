/*!
 * Build script for www.example.com.
 *
 * Copyright (c) 2017-2018 Kieran Potts
 * MIT License
 */

'use strict'

var buildgem = require('buildgem')
var copy = require('buildgem-copy')
var md = require('buildgem-md')
var sass = require('buildgem-sass')

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
        success: 'HTML files made'
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
        success: 'CSS compiled'
      }
    })
  ])
  .rebuild()
  .listen()
