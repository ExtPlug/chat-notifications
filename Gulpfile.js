var gulp   = require('gulp')
var babel  = require('gulp-babel')
var rjs    = require('requirejs')
var fs     = require('fs')
var mkdirp = require('mkdirp')
var del    = require('del')
var runseq = require('run-sequence')

gulp.task('clean-lib', function (cb) {
  del('lib', cb)
})

gulp.task('babel', function () {
  return gulp.src('src/**/*')
    .pipe(babel({ modules: 'ignore' }))
    .pipe(gulp.dest('lib/'))
})

gulp.task('rjs', [ 'babel' ], function (done) {
  rjs.optimize({
    baseUrl: './',
    name: 'extplug/chat-notifications/main',
    paths: {
      'extplug/chat-notifications': 'lib/',
      // plug files, define()d by plug-modules
      plug: 'empty:',
      // extplug defines
      extplug: 'empty:',
      // plug.dj language files
      lang: 'empty:',
      // libraries used by plug.dj
      backbone: 'empty:',
      jquery: 'empty:',
      underscore: 'empty:',
      // libraries used by extplug
      meld: 'empty:',
      'plug-modules': 'empty:'
    },
    optimize: 'none',
    out: function (text) {
      mkdirp('build', function (e) {
        if (e) done(e)
        else   fs.writeFile('build/chat-notifications.js', text, done)
      })
    }
  })
})

gulp.task('build', function (cb) {
  runseq('clean-lib', 'babel', 'rjs', cb)
})

gulp.task('default', [ 'build' ])
