var gulp = require('gulp'),
    concatify = require('gulp-concat'),
    minifyCSS = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync').create(),
    htmlreplace = require('gulp-html-replace'),
    minifyHTML = require('gulp-minify-html');

gulp.task('copy', function () {
    gulp.src('app/indexController.js')
        .pipe(gulp.dest('dist/'));
    gulp.src('app/service-worker.js')
        .pipe(gulp.dest('dist/'));
    gulp.src('app/data/*.*')
        .pipe(gulp.dest('dist/data')),
        gulp.src('app/lib/fonts/*.*')
            .pipe(gulp.dest('dist/lib/fonts'));
    gulp.src('app/lib/styles/*.ttf')
        .pipe(gulp.dest('dist/lib/styles')),
        gulp.src('app/lib/styles/*.woff')
            .pipe(gulp.dest('dist/lib/styles'));
});
gulp.task('replace', function () {

    gulp.src('app/index.html')
        .pipe(htmlreplace({
            'css':'styles/app.css',
            'csslib': './lib/styles/app_lib.css',
            'js':'scripts/app.js',
            'jslib': './lib/scripts/aap_lib.js',
        }))
        .pipe(gulp.dest('dist/'));
});
gulp.task('scripts', function () {
    gulp.src('app/scripts/**/*.js')
        .pipe(uglify())
        .pipe(concatify('app.js'))
        .pipe(gulp.dest('dist/scripts/')),
        gulp.src('app/lib/scripts/**/*.js')
            .pipe(uglify())
            .pipe(concatify('aap_lib.js'))
            .pipe(gulp.dest('dist/lib/scripts/'));
});
gulp.task('style', function () {
    gulp.src('app/styles/*.css')
        .pipe(minifyCSS())
        .pipe(concatify('app.css'))
        .pipe(gulp.dest('dist/styles/')),
        gulp.src('app/lib/styles/*.css')
            .pipe(minifyCSS())
            .pipe(concatify('app_lib.css'))
            .pipe(gulp.dest('dist/lib/styles/'));
});
gulp.task('html', function() {
    /*gulp.src('app/index.html')
     .pipe(minifyHTML({empty: true}))
     .pipe(gulp.dest('dist'));*/
    gulp.src('app/views/*.html')
        .pipe(minifyHTML({empty: true}))
        .pipe(gulp.dest('dist/views'));
});
gulp.task('watch', function () {
    gulp.watch('app/scripts/*.js', ['scripts']);

    gulp.watch('app/styles/*.css', ['style']);
});
gulp.task('serve', function () {
    browserSync.init({
        server: './app'
    });
});
gulp.task('serve:dist', function () {
    browserSync.init({
        server: './dist'
    });
});

gulp.task('default', ['copy', 'scripts','style','html','replace']);
/*gulp.task('default', ['scripts','style','html']);*/

