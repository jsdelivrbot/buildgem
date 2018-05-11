/*!
 * BuildGem plugin: compile CSS from Sass/Scss files
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
var sass = require('node-sass')
var path = require('path')

/**
 * Module exports.
 */
module.exports = plugin

/**
 * Plugin build function. Accepts options parameters and returns
 * the built plugin function
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

  /**
   * @param {String} source Path to the source directory
   * @param {String} destination Path to the build directory
   * @param {Function} next Next plugin in the chain
   */
  return function (source, destination, next) {
    var sources = []
    options.sources.match.forEach(function (match) {
      sources.push(path.join(source, options.sources.dir, match))
    })
    var files = globby.sync(sources)
    var tasks = files
      .map(compile)
      .map(write)

    Promise.all(tasks)
      .then(function () {
        if (options.messages && options.messages.success) {
          console.log(chalk.yellow(options.messages.success))
        }
        next()
      })

    /**
     * Compile a CSS string from a SCSS file.
     *
     * @param {String} file File path
     *
     * @returns {Object} Parsed CSS (.css) and map (.map) and filename (.name)
     */
    function compile (file) {
      var ext = path.extname(file)
      var name = path.relative(path.join(source, options.sources.dir), file)
        .replace(new RegExp(ext + '$'), '') // Remove extension
      try {
        var data = sass.renderSync({
          file: file,
          outputStyle: options.output.style,
          outFile: path.join(options.output.dir, name + '.' + options.output.ext),
          sourceMap: options.output.map || false
        })
      } catch (e) {
        console.error(e)
      }
      data.name = name

      return data
    }

    /**
     * Save the CSS string to the filesystem.
     *
     * @param {Object} data The file's parsed data
     * @param {Number} index The nth file to be parsed
     */
    function write (data, index) {
      try {
        fs.outputFileSync(path.join(destination, options.output.dir, data.name + '.' + options.output.ext), data.css)
        if (options.output.map) {
          fs.outputFileSync(path.join(destination, options.output.dir, data.name + '.' + options.output.ext + '.map'), data.map)
        }
      } catch (e) {
        console.error(e)
      }
    }
  }
}
