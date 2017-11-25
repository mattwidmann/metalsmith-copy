var debug = require('debug')('metalsmith-copy'),
    path = require('path'),
    cloneDeep = require('lodash').cloneDeep,
    minimatch = require('minimatch');

module.exports = plugin;

function plugin(options) {
  return function(files, metalsmith, done) {
    if (!options.hasOwnProperty('directory')
        && !options.hasOwnProperty('extension')
        && !options.hasOwnProperty('transform')) {
      return done(new Error('metalsmith-copy: one of "directory", "extension", or "transform" option required'));
    }

    if (!options.hasOwnProperty('force')) {
      options.force = false;
    }

    var matcher = minimatch.Minimatch(options.pattern);
    var ignorer = undefined;
    if (options.ignore) {
      ignorer = minimatch.Minimatch(options.ignore);
    }

    Object.keys(files).forEach(function (file) {
      debug('checking file: ' + file);
      if (!matcher.match(file)) {
        debug('did not match pattern');
        return;
      }
      if (ignorer && ignorer.match(file)) {
        debug('explicitly ignored');
        return;
      }

      var newName = file;

      // transform filename
      if (options.transform) {
        newName = options.transform(file);
      } else {
        if (options.extension) {
          var currentExt = path.extname(file);
          newName = path.join(path.dirname(file), path.basename(file, currentExt) + options.extension);
        }
        if (options.directory) {
          newName = path.join(options.directory, path.basename(newName));
        }
      }

      if (newName === file) {
        debug('copy unchanged')
        return;
      }

      if (files[newName] && options.force === false) {
        return done(new Error('metalsmith-copy: copying ' + file + ' to ' + newName + ' would overwrite file'));
      }

      debug('copying file as ' + newName);
      files[newName] = cloneDeep(files[file], function(value) {
        if (value instanceof Buffer) {
          return new Buffer(value);
        }
      });
      if (options.move) {
        delete files[file];
      }
    });

    done();
  }
}
