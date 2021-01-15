const gulp = require('gulp')
const glob = require('glob')
const plumber = require('gulp-plumber')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const rollup = require('gulp-rollup')
const es = require('event-stream')
const { files } = require('./config')
const esTasks = []
files.forEach(file => {
  const ROLLUP_FILE = glob.sync(file.src)
  console.log('file', file)
  esTasks.push(
    gulp
      .src([file.src])
      .pipe(
        rollup({
          allowRealFiles: true,
          input: ROLLUP_FILE,
          /**
           * 不在控制台输出 warning，例如 Use of eval is strongly discouraged, as it poses security risks and may cause issues with minification
           */
          onwarn() {},
          output: {
            /**
             * format 输出的文件类型 amd, cjs, es, iife, umd
             */
            format: 'cjs'
          }
        })
      )
      .pipe(
        babel({
          presets: ['@babel/env']
        })
      )
      .pipe(
        uglify({
          mangle: {
            toplevel: true
          }
        })
      )
      .pipe(
        rename({
          suffix: '.min'
        })
      )
      .pipe(plumber())
      .pipe(gulp.dest(file.dest))
  )
})

gulp.task('pack', done => {
  es.merge(esTasks)
  done()
})

// gulp.task('dev', gulp.series('pack'))

// gulp.watch(SRC.js, gulp.series('pack')).on('change', filePath => {
//   console.log(`${filePath} changed`)
// })
