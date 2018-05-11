/*!
 * BuildGem. A pluggable build automation framework.
 *
 * Copyright (c) 2018 Kieran Potts
 * MIT License
 */

'use strict'

/**
 * Module dependencies.
 * @private
 */
var async = require('async')
var chalk = require('chalk')
var chokidar = require('chokidar')
var del = require('del')

/**
 * Module exports.
 */
module.exports = BuildGem

/**
 * Initialize a new build.
 */
function BuildGem () {
  if (!(this instanceof BuildGem)) {
    return new BuildGem()
  }
  this.conf = {
    plugins: [],
    path: {
      source: './src',
      build: './build'
    }
  }
}

/**
 * Set the source directory.
 *
 * @param {String} src
 * @return {BuildGem}
 */
BuildGem.prototype.from = function (source) {
  this.conf.path.source = source
  return this
}

/**
 * Set the build destination directory.
 *
 * @param {String} build
 * @return {BuildGem}
 */
BuildGem.prototype.to = function (build) {
  this.conf.path.build = build
  return this
}

/**
 * Add one or more plugin functions to the stack.
 *
 * @param {Array} plugins
 * @return {BuildGem}
 */
BuildGem.prototype.via = function (plugins) {
  Array.prototype.push.apply(this.conf.plugins, plugins)
  return this
}

/**
 * Run the build tasks.
 *
 * Optionally, supply a callback to run when the build is finished.
 *
 * @param {Function} done
 * @return {BuildGem}
 */
BuildGem.prototype.build = function (done) {
  if (!this.conf.path.source) {
    console.error(chalk.red('Source path not defined'))
    return this
  }
  if (!this.conf.path.build) {
    console.error(chalk.red('Build path not defined'))
    return this
  }
  if (this.conf.plugins.length === 0) {
    console.error(chalk.red('No plugins added'))
    return this
  }

  done = done || function (err, data) {
    if (err) throw err
    console.log(chalk.green('Build finished'))
  }

  // Wrap plugins in async-compatible functions.

  var handlers = []
  this.conf.plugins.forEach(function (plugin, i) {
    handlers[i] = function (callback) {
      plugin(this.conf.path.source, this.conf.path.build, callback)
    }.bind(this)
  }, this)

  async.series(handlers, done)
}

/**
 * Start a new build from scratch.
 *
 * Optionally, supply a callback to run when the rebuild is finished.
 *
 * @param {Function} done
 * @return {BuildGem}
 */
BuildGem.prototype.rebuild = function (done) {
  del(this.conf.path.build, '!.git', '!.svn').then(paths => {
    this.build(done)
  })

  return this
}

/**
 * Update the build dynamically when there are changes made to the source files.
 *
 * @return {BuildGem}
 */
BuildGem.prototype.listen = function (done) {
  if (!this.conf.path.source) {
    console.error(chalk.red('Source path not defined'))
    return this
  }

  done = done || function (err, data) {
    if (err) throw err
    console.log(chalk.green('Build updated'))
  }

  chokidar
    .watch(this.conf.path.source)
    .on('change', function (file) {
      this.build(done)
    }.bind(this))

  return this
}
