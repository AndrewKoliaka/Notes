const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const htmlMin = require('gulp-htmlmin');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const merge = require('merge-stream');
const del = require('del');

const pathTo = {
    bin: {
        folder: 'bin',
        views: 'bin/views',
        js: 'bin/js',
        css: 'bin/css'
    },
    src: {
        views: 'public/src/views/**/*.html',
        js: 'public/src/**/*.js',
        css: 'public/styles.css',
        index: 'public/index.html'
    },
    libs: {
        css: [
            "node_modules/milligram/dist/milligram.min.css"
        ],
        js: [
            "node_modules/angular/angular.min.js",
            "node_modules/angular-ui-router/release/angular-ui-router.min.js",
            "node_modules/angular-resource/angular-resource.min.js"
        ]
    }
}

gulp.task('libs', () => {
    const jsLibs = gulp.src(pathTo.libs.js)
        .pipe(concat('libs.js'))
        .pipe(gulp.dest(pathTo.bin.js));

    const cssLibs = gulp.src(pathTo.libs.css)
        .pipe(concat('libs.css'))
        .pipe(gulp.dest(pathTo.bin.css));

    return merge(jsLibs, cssLibs);
});

gulp.task('css', () =>
    gulp.src(pathTo.src.css)
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(gulp.dest(pathTo.bin.css))
);

gulp.task('js', () =>
    gulp.src(pathTo.src.js)
        .pipe(concat('app.js'))
        .pipe(babel())
        .pipe(uglify({
            mangle: false
        }))
        .pipe(gulp.dest(pathTo.bin.js))
);

gulp.task('views', () => {
    const subViews = gulp.src(pathTo.src.views)
        .pipe(htmlMin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(pathTo.bin.views));

    const index = gulp.src(pathTo.src.index)
        .pipe(htmlMin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(pathTo.bin.folder));

    return merge(subViews, index);
});

gulp.task('del', () => del([pathTo.bin.folder]));

gulp.task('watch', () => {
    gulp.watch(pathTo.src.css, ['css']);
    gulp.watch(pathTo.src.js, ['js']);
    gulp.watch([pathTo.src.views, pathTo.src.index], ['views']);
});

gulp.task('build', ['libs', 'js', 'css', 'views']);

gulp.task('default', ['build', 'watch']);
