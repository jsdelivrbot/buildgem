/*!
 * BuildGem plugin: copy files verbatim from source to build directories.
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

/**
 * Module exports.
 */
module.exports = plugin

/**
 * Plugin build function. Accepts options parameters and returns
 * the built plugin function.
 *
 * @since 1.0.0
 * @param {Object} options Plugin settings.
 * @returns {Function}
 * @example
 *
 * plugin({ sources: ['*.ext']});
 * // => Function
 */
function plugin (options) {
  options = options || {}

  /**
   * Plugin function.
   *
   * @param {String} source Path to the source directory.
   * @param {String} destination Path to the build directory.
   * @param {Function} next Next plugin in the chain.
   */

  return function (source, destination, next) {
    var sources = []
    options.input.match.forEach(function (match) {
      sources.push(path.join(source, options.input.dir, match))
    })
    var files = globby.sync(sources)
    var tasks = files
      .map(copy)

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
    function copy (file) {
      var dest = path.join(destination, path.relative(path.join(source, options.input.dir), file))
      try {
        fs.copySync(file, dest)
      } catch (err) {
        console.error(chalk.red(err))
      }
    }
  }
}
