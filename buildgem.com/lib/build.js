/*!
 * Build script for www.buildgem.com.
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
        match: ['**/.*', '**/*.*', 'CNAME']
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
        },
        data: {
          app_name: 'BuildGem'
        }
      },
      messages: {
        success: 'HTML files made'
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
