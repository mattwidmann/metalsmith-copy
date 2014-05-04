var assert = require('assert'),
    dir_equal = require('assert-dir-equal'),
    metalsmith = require('metalsmith'),
    copy = require('..');

describe('metalsmith-copy', function () {
  it('should copy and change the extension', function (done) {
    metalsmith('test/fixtures/simple')
      .use(copy({
        pattern: '*.md',
        extension: '.text'
      }))
      .build(function (err) {
        if (err) return done(err);
        dir_equal('test/fixtures/simple/expected_ext', 'test/fixtures/simple/build');
      });
    return done();
  });

  it('should copy and change the directory', function (done) {
    metalsmith('test/fixtures/simple')
      .use(copy({
        pattern: '*.md',
        directory: 'out'
      }))
      .build(function (err) {
        if (err) return done(err);
        dir_equal('test/fixtures/simple/expected_dir', 'test/fixtures/simple/build');
      });
    return done();
  })

  it('should copy and change both the directory and extension', function (done) {
    metalsmith('test/fixtures/simple')
      .use(copy({
        pattern: '*.md',
        extension: '.text',
        directory: 'out'
      }))
      .build(function (err) {
        if (err) return done(err);
        dir_equal('test/fixtures/simple/expected_both', 'test/fixtures/simple/build');
      });
    return done();
  })

  it('should not copy files not matching the pattern', function (done) {
    metalsmith('test/fixtures/simple')
      .use(copy({
        pattern: '*.mkd',
        extension: '.text'
      }))
      .build(function (err) {
        if (err) return done(err);
        dir_equal('test/fixtures/simple/expected_simple', 'test/fixtures/simple/build');
      });
    return done();
  })

  it('should transform files using provided function', function (done) {
    metalsmith('test/fixtures/simple')
      .use(copy({
        pattern: '*.md',
        transform: function (file) {
          return file + '.bak';
        }
      }))
      .build(function (err) {
        if (err) return done(err);
        dir_equal('test/fixtures/simple/expected_transform', 'test/fixtures/simple/build');
      });
    return done();
  })

  it('should fail if no valid options are specified', function (done) {
    assert.throws(function () {
      metalsmith('test/fixtures/simple')
      .use(copy({
        pattern: '*.md'
      }))
      .build(function (err) {
        if (err) return done(err);
      });
    }, Error);
    return done();
  })

  it('should not overwrite files that already exist', function (done) {
    metalsmith('test/fixtures/simple')
      .use(copy({
        pattern: '*.md',
        extension: '.md'
      }))
      .build(function (err) {
        assert(err, 'overwrote file that already existed');
      });
    return done();
  })
});

