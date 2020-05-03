const gulp = require('gulp');
const internalIp = require('internal-ip');
const package = require('./package.json');
const path = require('path');
const shell = require('gulp-shell');

/**
 * Template for banner to add to file headers
 */
var banner = {
	main:
		'/*!' +
		' <%= package.name %> v<%= package.version %>' +
		' | (c) ' + new Date().getFullYear() + ' <%= package.author.name %>' +
		' | <%= package.license %> License' +
		' | <%= package.homepage %>' +
		' */\n'
};

/**
 * ----------------------------------------
 *  SCRIPTS TASKS
 * ----------------------------------------
 */
gulp.task('scripts:build', function(done) {
    const cleanDir = require('gulp-clean-dir');
    const fs = require('fs');
    const header = require('gulp-header');
    const nop = require('gulp-nop');
    const parsePath = require('parse-filepath');
    const rename = require("gulp-rename");
    const webpack = require('webpack-stream');

    distPath = parsePath(package.script);

    if (fs.existsSync(path.resolve(__dirname, 'src/js/index.js'))) {
        return gulp.src(path.resolve(__dirname, 'src/js/index.js'))
            .pipe(webpack(require('./webpack.config.js')))
            .pipe(header(banner.main, {package: package}))
            .pipe(rename(distPath.basename.replace('.min', '')))
            .pipe(cleanDir(path.resolve(__dirname, distPath.dirname)))
            .pipe(gulp.dest(path.resolve(__dirname, distPath.dirname)));
    } else {
		return gulp.src('.').pipe(nop());
	}
});

gulp.task('scripts:minify', function(done) {
    const header = require('gulp-header');
    const parsePath = require('parse-filepath');
    const rename = require("gulp-rename");
    const terser = require('gulp-terser');
    
    distPath = parsePath(package.script);

	return gulp.src([path.resolve(__dirname, distPath.dirname + '/*.js'), '!' + path.resolve(__dirname, distPath.dirname + '/*.min.js')])
        .pipe(terser({                
            compress: true,
            keep_fnames: true,
            ie8: false,
            mangle: true,
            output: {
                comments: false
            }
        }))
        .pipe(header(banner.main, {package: package}))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(path.resolve(__dirname, distPath.dirname)));
});

gulp.task('scripts:copy', function() {
    const fs = require('fs');
    const gulpif = require('gulp-if');
    const parsePath = require('parse-filepath');

    distPath = parsePath(package.script);

    return gulp.src(distPath.dirname + '/*.js')
        .pipe(gulp.dest(path.resolve(__dirname, 'src/docs/static/js')))
        .pipe(gulpif(fs.existsSync(path.resolve(__dirname, 'src/demo')), gulp.dest(path.resolve(__dirname, 'src/demo/static/js'))));
});

/**
 * ----------------------------------------
 *  STYLESHEETS TASKS
 * ----------------------------------------
 */
gulp.task('styles:build', function() {
    const autoprefixer = require('autoprefixer');
    const cleanDir = require('gulp-clean-dir');
    const concat = require('gulp-concat');
    const fs = require('fs');
    const header = require('gulp-header');
    const nop = require('gulp-nop');
    const parsePath = require('parse-filepath');
    const postcss = require('gulp-postcss');
    const rename = require("gulp-rename");
    const sass = require('gulp-sass');

    distPath = parsePath(package.style);

    if (fs.existsSync(path.resolve(__dirname, 'src/sass/index.sass'))) {
        return gulp.src(['node_modules/bulma/sass/utilities/_all.sass', 'node_modules/bulma/sass/form/shared.sass', 'node_modules/bulma/sass/components/dropdown.sass', 'src/sass/index.sass'])
            .pipe(concat('app.sass'))
            .pipe(sass({
                loadPath: [path.resolve(__dirname, 'src/sass')],
                includePaths: ['node_modules', 'node_modules/bulma/sass/utilities/'],
                outputStyle: "expanded",
                sourceComments: true
            }).on('error', sass.logError))
            .pipe(postcss([
                autoprefixer({
                    cascade: true,
                    remove: true
                })
            ]))
            .pipe(header(banner.main, {package: package}))
            .pipe(rename(distPath.basename.replace('.min', '')))
            .pipe(cleanDir(path.resolve(__dirname, distPath.dirname)))
            .pipe(gulp.dest(path.resolve(__dirname, distPath.dirname)));
        } else {
            return gulp.src('.').pipe(nop());
        }
});

gulp.task('styles:minify', function() {
    const cleancss = require('gulp-cleancss');
    const cssnano = require('cssnano');
    const header = require('gulp-header');
    const parsePath = require('parse-filepath');
    const postcss = require('gulp-postcss');
    const rename = require("gulp-rename");

    distPath = parsePath(package.style);

    return gulp.src([path.resolve(__dirname, distPath.dirname + '/*.css'), '!' + path.resolve(__dirname, distPath.dirname + '/*.min.css')])
        .pipe(cleancss())
        .pipe(postcss([
            cssnano({
				discardComments: {
					removeAll: true
				}
			})
        ]))
        .pipe(header(banner.main, {package: package}))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(path.resolve(__dirname, distPath.dirname)));
});

gulp.task('styles:copy', function() {
    const fs = require('fs');
    const gulpif = require('gulp-if');
    const parsePath = require('parse-filepath');

    distPath = parsePath(package.style);

    return gulp.src(path.resolve(__dirname, distPath.dirname + '/*.css'))
        .pipe(gulp.dest(path.resolve(__dirname, 'src/docs/static/css')))
        .pipe(gulpif(fs.existsSync(path.resolve(__dirname, 'src/demo')), gulp.dest(path.resolve(__dirname, 'src/demo/static/css'))));
});

/**
 * ----------------------------------------
 *  ASSETS TASKS
 * ----------------------------------------
 */
gulp.task('images:svg:minify', function() {
	const svgmin = require('gulp-svgmin');

	return gulp.src(path.resolve(__dirname, 'dist/images/**/*.svg'))
        .pipe(svgmin())
		.pipe(gulp.dest(path.resolve(__dirname, 'dist/images')));
});

/**
 * ----------------------------------------
 *  BUILD TASKS
 * ----------------------------------------
 */
gulp.task('build:styles', gulp.series('styles:build', 'styles:minify', 'styles:copy'), done => {
	done();
});

gulp.task('build:scripts', gulp.series('scripts:build', 'scripts:minify', 'scripts:copy'), done => {
	done();
});

gulp.task('build', gulp.series('build:styles', 'build:scripts'), done => {
	done();
});

gulp.task('optimize', gulp.series('scripts:minify', 'styles:minify', 'images:svg:minify'), done => {
	done();
});

gulp.task('default', gulp.series('build', 'optimize'), done => {
	done();
});

/**
 * ----------------------------------------
 *  DEMO TASKS
 * ----------------------------------------
 */
gulp.task('demo:build', gulp.series(shell.task(['node_modules/.bin/hugo --source src/demo --destination ../../demo --cleanDestinationDir'])), done => {
    done();
});

gulp.task('demo:serve', gulp.parallel(shell.task([`node_modules/.bin/hugo server -D --bind ${internalIp.v4.sync()} --baseURL ${internalIp.v4.sync()} --source src/demo --watch`]), function() {
    gulp.watch(path.resolve(__dirname, 'src/sass/**/*.sass'), gulp.series('build:styles'));
    gulp.watch(path.resolve(__dirname, 'src/js/**/*.js'), gulp.series('build:scripts'));
}), done => {
    done();
});

gulp.task('demo', gulp.series(shell.task(['node_modules/.bin/hugo server --source src/demo'])), done => {
    done();
});

/**
 * ----------------------------------------
 *  DOC TASKS
 * ----------------------------------------
 */
gulp.task('doc:build', gulp.series(shell.task(['node_modules/.bin/hugo --source src/docs --destination ../../docs --cleanDestinationDir'])), done => {
    done();
});

gulp.task('doc:serve', gulp.parallel(shell.task([`node_modules/.bin/hugo server -D --bind ${internalIp.v4.sync()} --baseURL ${internalIp.v4.sync()} --source src/docs --watch`]), function() {
    gulp.watch(path.resolve(__dirname, 'src/sass/**/*.sass'), gulp.series('build:styles'));
    gulp.watch(path.resolve(__dirname, 'src/js/**/*.js'), gulp.series('build:scripts'));
}), done => {
    done();
});

gulp.task('doc', gulp.series(shell.task(['node_modules/.bin/hugo server --source src/docs'])), done => {
    done();
});