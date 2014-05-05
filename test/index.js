var assert = require('assert'),
    dir_equal = require('assert-dir-equal'),
    metalsmith = require('metalsmith'),
    collections = require('metalsmith-collections'),
    copy = require('..');

describe('metalsmith-copy', function() {
  it('should copy and change the extension', function(done) {
    metalsmith('test/fixtures/simple').use(copy({
        pattern: '*.md',
        extension: '.text'
      })).use(function(files, metalsmith, pluginDone) {
        assert(files['index.text'], 'file was copied');
        pluginDone();
      }).build(function(err) {
        if (err) done(err)
        else done();
      });
  });

  it('should copy and change the directory', function(done) {
    metalsmith('test/fixtures/simple').use(copy({
        pattern: '*.md',
        directory: 'out'
      })).use(function(files, metalsmith, pluginDone) {
        assert(files['out/index.md'], 'file was copied');
        pluginDone();
      }).build(function(err) {
        if (err) done(err)
        else done();
      });
  });

  it('should copy and change both the directory and extension', function(done) {
    metalsmith('test/fixtures/simple').use(copy({
        pattern: '*.md',
        extension: '.text',
        directory: 'out'
      })).use(function(files, metalsmith, pluginDone) {
        assert(files['out/index.text'], 'file was copied');
        pluginDone();
      }).build(function(err) {
        if (err) done(err)
        else done();
      });
  });

  it('should not copy files not matching the pattern', function(done) {
    metalsmith('test/fixtures/simple').use(copy({
        pattern: '*.mkd',
        extension: '.text'
      })).use(function(files, metalsmith, pluginDone) {
        assert(!files['index.text'], 'file was not copied');
        pluginDone();
      }).build(function(err) {
        if (err) done(err)
        else done();
      });
  });

  it('should transform files using provided function', function(done) {
    metalsmith('test/fixtures/simple').use(copy({
        pattern: '*.md',
        transform: function(file) {
          return file + '.bak';
        }
      })).use(function(files, metalsmith, pluginDone) {
        assert(files['index.md.bak'], 'file was copied');
        pluginDone();
      }).build(function(err) {
        if (err) done(err)
        else done();
      });
  });

  describe('error handling', function() {
    it('should fail if no valid options are specified', function(done) {
      metalsmith('test/fixtures/simple').use(copy({
        pattern: '*.md'
      })).build(function(err) {
        assert(err, 'did not fail when incorrect options were specified');
        done();
      });
    });

    it('should not overwrite files that already exist', function(done) {
      metalsmith('test/fixtures/simple').use(copy({
        pattern: '*.md',
        extension: '.md'
      })).build(function(err) {
        assert(err, 'overwrote file that already existed');
        done();
      });
    });

      // if the copy was shallow, collections would mark the file with extension .md as part of the articles collection and that value would be shared to the copy, the file with extension .text, so make sure that the collection only contains 1 file if collections executes after the copy
    it('should do a deep copy of the file', function(done) {
      done();
      var m = metalsmith('test/fixtures/simple');

      m.use(copy({
        pattern: '*.md',
        extension: '.text'
      })).use(collections({
        articles: {
          pattern: "*.md"
        }
      })).build(function(err) {
        if (err) return done(err);
        assert(m.metadata().articles.length == 1, 'changes made to original file were incorrectly propogated to copy');
        done();
      });
    });
  });
});

