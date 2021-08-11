const gulp = require('gulp');
const watch = require('gulp-watch');
const babel = require('gulp-babel');
const environments = require('gulp-environments');
const uglifycss = require('gulp-uglifycss');
const terser = require('gulp-terser');
const postcss = require('gulp-postcss');
const purgecss = require('gulp-purgecss');
const production = environments.production;
const browserSync = require('browser-sync').create();

gulp.task('watch', () => {
	browserSync.init({proxy: 'localhost:8080',});
	gulp.watch(['src/main/resources/templates/*.html'], gulp.series('copy-html-and-reload'));
	gulp.watch(['src/main/resources/static/css/*.css'], gulp.series('copy-css-and-reload'));
	gulp.watch(['src/main/resources/static/js/*.js'], gulp.series('copy-js-and-reload'));
	gulp.watch(['src/main/resources/static/img/*'], gulp.series('copy-img-and-reload'));
	
});

gulp.task('copy-html', () => gulp.src(['src/main/resources/templates/*.html'])
	.pipe(gulp.dest('target/classes/templates/')));

gulp.task('copy-css', () => gulp.src(['src/main/resources/static/css/*.css'])
	.pipe(postcss([
		require('tailwindcss')("./tailwind.config.js"),
		require('autoprefixer'),
	]))
	.pipe(production(purgecss({
		content: ['src/main/resources/templates/**/*.html'],
		css: ['src/main/resources/static/css/tailwind.css'],
		options: {
			keyframes: true,
			fontFace: true,
		}
	})))
	.pipe(production(uglifycss()))
	.pipe(gulp.dest('target/classes/static/css/')));

gulp.task('copy-js', () => gulp.src(['src/main/resources/static/js/*.js'])
	.pipe(babel())
	.pipe(production(terser()))
	.pipe(gulp.dest('target/classes/static/js/')));

gulp.task('copy-img', () => gulp.src(['src/main/resources/static/img/*'])
	.pipe(gulp.dest('target/classes/static/img/')));

gulp.task('copy-html-and-reload', gulp.series('copy-html', reload));
gulp.task('copy-css-and-reload', gulp.series('copy-css', reload));
gulp.task('copy-js-and-reload', gulp.series('copy-js', reload));
gulp.task('copy-img-and-reload', gulp.series('copy-img', reload));

gulp.task('build', gulp.series('copy-html', 'copy-css', 'copy-js', 'copy-img'));
gulp.task('default', gulp.series('watch'));

function reload(done) {
	browserSync.reload();
	done();
}