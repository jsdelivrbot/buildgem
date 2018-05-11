/*!
 * BuildGem plugin: generated HTML documents from Markdown files with metadata
 * defined via YAML front-matter.
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
var markdown = require('markdown-it')({
  html: false, // Enable HTML tags in source
  xhtmlOut: true, // Use '/' to close single tags (<br />)
  breaks: true, // Convert '\n' in paragraphs into <br>
  langPrefix: '', // CSS language prefix for fenced code blocks
  linkify: true, // Autoconvert URL-like text to links
  typographer: false, // Enable quotes and other text beautification
  quotes: '“”‘’' // Beautiful quotes
})
var path = require('path')
var posthtml = require('posthtml')
var Handlebars = require('handlebars')
var yaml = require('yaml-front-matter')

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
  var REGEX_NEWLINES = /^\n+/

  /**
   * Plugin function.
   *
   * @param {String} source Path to the source directory
   * @param {String} destination Path to the build directory
   * @param {Function} next Next plugin in the chain
   */
  return function (source, destination, next) {
    var sources = []
    options.sources.markdown.match.forEach(function (match) {
      sources.push(path.join(source, options.sources.markdown.dir, match))
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
      var name = path.relative(path.join(source, options.sources.markdown.dir), file)
        .replace(new RegExp(ext + '$'), '') // Remove extension
      try {
        var contents = fs.readFileSync(file, 'utf-8')
        var data = Object.assign({}, options.sources.data, yaml.loadFront(contents, 'markdown'))
        data.__markdown__ = data.markdown.replace(REGEX_NEWLINES, '')
        data.__article__ = (data.markdown ? markdown.render(data.markdown) : '')
      } catch (e) {
        console.error(e)
      }
      data.__path__ = name

      // The canonical path uses forward slashes, never backward slashes,
      // for directory separators, is prefixed with '/', and the word "index"
      // is removed from the end.

      var tmp = '/' + data.__path__.replace(/\\/g, '/')
      tmp = tmp.replace(/\/index$/, '/')
      data.__canonical__ = tmp

      // Build version. If now is 2017-01-15T14:48:00.000Z, the build
      // version will be 20170115144800.

      var date = new Date()
      data.__build__ = date.toISOString().slice(0, 19).replace(/[-T:]/g, '')

      return data
    }

    /**
     * Process a source file.
     *
     * @param {Object} data The file's parsed data.
     * @param {Number} index The nth file to be parsed.
     */
    function render (data, index) {
      if (data.status !== 'published') return
      var saveas = path.join(destination, data.__path__ + '.html')

      Promise.resolve(makeHtml(data))
        .then(save(saveas))
    }

    /**
     * Generate an HTML string from a data object.
     *
     * @param {Object} data A source file's parsed data.
     *
     * @returns {String}
     */
    function makeHtml (data) {
      var filepath = path.join(source, options.sources.templates.dir, data.template + '.' + options.sources.templates.ext)
      try {
        var contents = fs.readFileSync(filepath, 'utf-8')
      } catch (e) {
        console.error(e)
      }

      // Process <include> elements within the template.

      var html = ''

      try {
        contents = posthtml()
          .use(require('posthtml-include')({
            encoding: 'utf-8',
            root: path.join(source, options.sources.templates.dir)
          }))
          .process(contents, { sync: true })
          .html
      } catch (err) {
        console.error(chalk.red(err))
      }

      try {
        var template = Handlebars.compile(contents)
        html = template(data)
      } catch (err) {
        console.error(chalk.red(err))
      }

      return html
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
