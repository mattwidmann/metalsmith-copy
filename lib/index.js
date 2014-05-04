var debug = require('debug')('metalsmith-copy'),
    path = require('path'),
    minimatch = require('minimatch');

module.exports = plugin;

function plugin(options) {
  return function(files, metalsmith, done) {
    var matches = [];
    var matcher = minimatch.Minimatch(options.pattern);

    Object.keys(files).forEach(function (file) {
      debug('checking file: ' + file);
      if (!matcher.match(file)) return;

      var newName = file;
      if (options.extension) {
        var currentExt = path.extname(file);
        newName = path.join(path.dirname(file), path.basename(file, currentExt) + options.extension);
      }
      if (options.directory) {
        newName = path.join(options.directory, path.basename(newName));
      }

      debug('copying file: ' + newName);
      files[newName] = files[file];
    });

    done();
  }
}
