/*!
 * BuildGem plugin: generate RSS feeds from simple YAML configuration files.
 *
 * Copyright (c) 2017-2018 Kieran Potts
 * MIT License
 */

'use strict'

/**
 * Module dependencies.
 * @private
 */
var chalk = require('chalk')
var fs = require('fs-extra')
var globby = require('globby')
var path = require('path')
var RSS = require('rss')
var yaml = require('js-yaml')

/**
 * Module exports.
 */
module.exports = plugin

/**
 * Plugin build function. Accepts options parameters and returns
 * the built plugin function.
 *
 * @since 1.0.0
 * @param {Object} options Plugin settings
 * @returns {Function}
 * @example
 *
 * plugin({ sources: ['*.ext']});
 * // => Function
 */
function plugin (options) {
  options = options || {}
  // var REGEX_NEWLINES = /^\n+/

  /**
   * Plugin function.
   *
   * @param {String} source Path to the source directory
   * @param {String} destination Path to the build directory
   * @param {Function} next Next plugin in the chain
   */
  return function (source, destination, next) {
    var sources = []
    options.sources.yaml.match.forEach(function (match) {
      sources.push(path.join(source, options.sources.yaml.dir, match))
    })
    var files = globby.sync(sources)
    var tasks = files
      .map(read)
      .map(render)

    Promise.all(tasks)
      .then(function () {
        if (options.messages && options.messages.success) {
          console.log(chalk.yellow(options.messages.success))
        }
        next()
      })

    /**
     * Extract data from a file.
     *
     * @param {String} file File path.
     *
     * @returns {Object} Parsed file contents.
     */
    function read (file) {
      var ext = path.extname(file)
      var name = path.relative(path.join(source, options.sources.yaml.dir), file)
        .replace(new RegExp(ext + '$'), '') // Remove .yaml extension
      try {
        var data = yaml.safeLoad(fs.readFileSync(file, 'utf-8'))
      } catch (e) {
        console.error(e)
      }
      data.__path__ = name

      return data
    }

    /**
     * Process a source file.
     *
     * @param {Object} data The file's parsed data.
     * @param {Number} index The nth file to be parsed.
     */
    function render (data, index) {
      var saveas = path.join(destination, data.__path__ + '.rss')

      Promise.resolve(make(data))
        .then(save(saveas))
    }

    /**
     * Generate an RSS string from a data object.
     *
     * @param {Object} data A source file's parsed data.
     *
     * @returns {String}
     */
    function make (data) {
      try {
        var feed = new RSS({
          title: data.title || 'RSS Feed',
          description: data.description || '',
          site_url: data.link || ''
        })
        data.items.forEach(function (item) {
          feed.item({
            title: item.title,
            description: item.description,
            url: item.url,
            guid: item.url,
            date: item.date
          })
        })
        var xml = feed.xml({ indent: true })
      } catch (e) {
        console.error(e)
      }

      return xml
    }

    /**
     * Save a file to a given location. Returns a function that accepts
     * the file's contents.
     *
     * @param {String} saveas Destination file path.
     *
     * @returns {Function}
     */
    function save (saveas) {
      return function (content) {
        try {
          fs.outputFileSync(saveas, content)
        } catch (e) {
          console.error(e)
        }
      }
    }
  }
}
