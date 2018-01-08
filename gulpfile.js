// Load Node Modules/Plugins
var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var browserSync = require('browser-sync');
var del = require('del');
var gutil = require('gulp-util');

var reload = browserSync.reload;
var $ = gulpLoadPlugins();

gulp.task('clean', del.bind(null, ['docs/dist', 'dist']));

// Build LibSass files
gulp.task('styles', function() {
  gulp.src('./scss/theme.scss')
  .pipe($.plumber())
  .pipe($.sourcemaps.init())
  .pipe($.sass().on('error', $.sass.logError))
  .pipe($.autoprefixer({browsers: ['last 2 versions', 'ie >= 9']}))
  .pipe($.rename({ suffix: '.min' }))
  .pipe(gulp.dest('dist/css'))
  .pipe($.minifyCss())
  .pipe(gulp.dest('dist/css'));
  });


  // Build JavaScript files 
gulp.task('scripts', function() {
  return gulp.src(['js/src/app.js'])
  .pipe($.babel({presets:'es2015'}))
  .pipe($.concat('./app.js'))
  .pipe(gulp.dest('dist/js'));
});

// Watch tasks
gulp.task('watch', function() {     
  gulp.watch('scss/*.scss', ['styles']);
  gulp.watch('js/src/*.js', ['scripts']); 
});

gulp.task('dist', ['styles', 'scripts']);
gulp.task('default', ['clean'], () => {
  gulp.start('dist');
});


gulp.task('serve', ['styles', 'scripts'], function() {

  browserSync.init({
      server: "./"
  });

  gulp.watch('scss/*.scss', ['styles']).on('change', browserSync.reload);
  gulp.watch('js/src/*.js', ['scripts']).on('change', browserSync.reload); 
  gulp.watch("*.html").on('change', browserSync.reload);
});
