/*
 * grunt-htmltidy
 * http://gruntjs.com/
 *
 * Copyright (c) 2014 Gavin Ballard, contributors
 * Licensed under the MIT license.
 */

'use strict';
var chalk = require('chalk');
var prettyBytes = require('pretty-bytes');
var tidy = require('htmltidy').tidy;

module.exports = function (grunt) {
  grunt.registerMultiTask('htmltidy', 'Tidy HTML', function () {
    var options = this.options();
    var async = grunt.util.async;
    var done = this.async();

    async.forEach(this.files, function(file, asyncCallback) {
      var src = file.src[0];

      if (!grunt.file.exists(src || ' ')) {
        return grunt.log.warn('Source file "' + chalk.cyan(src) + '" not found.');
      }

      var untidied = grunt.file.read(src);

      if (untidied.length === 0) {
        return grunt.log.warn('Destination ' + chalk.cyan(src) + ' not written because source file was empty.');
      }

      // Make asynchronous call to tidy()
      tidy(untidied, options, function(err, tidied) {
        if(err) {
          grunt.warn(file.src + '\n' + err);
          return asyncCallback(err);
        }

        if (tidied.length === 0) {
          return grunt.log.warn('Destination ' + chalk.cyan(src) + ' not written because there was nothing to tidy.');
        }

        grunt.file.write(file.dest, tidied);
        grunt.log.writeln('Tidied ' + chalk.cyan(file.dest) + ' ' + prettyBytes(untidied.length) + ' → ' + prettyBytes(tidied.length));

        asyncCallback();
      }, function(err) {
        done(!err);
      });
    });
  });
};