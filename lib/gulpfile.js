// 支持输出 lib dist es 和统一的 dist 遵循组件库不处理 less 文件
const gulp = require('gulp');
const fs = require('fs');
const del = require('del');
const through2 = require('through2');
const merge2 = require('merge2');
const minify = require('gulp-babel-minify');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const path = require('path');
const webpack = require('webpack');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const getWebpackConfig = require('./webpackConfig');
const getCommonBabelConfig = require('./getCommonBabelConfig');
const cwd = process.cwd();

gulp.task('css', () => {
    const less = require('gulp-less');
    return gulp
        .src('components/**/*.less')
        .pipe(less())
        .pipe(postcss([autoprefixer({
            remove: false,
        })]))
        .pipe(gulp.dest('assets'));
});
function babelify(modules) {
    const streams = [];
    let src = '../components';
    const assets = gulp
        .src([`${src}/**/*.@(png|svg|less|d.ts)`])
        .pipe(gulp.dest(modules === false ? 'es' : 'lib'));
    streams.push(babelifyInternal(gulp.src([`${src}/**/*.js`, `${src}/**/*.jsx`]), modules));
    return merge2(streams.concat([assets]));
}

function babelifyInternal(js, modules) {
    function replacer(match, m1, m2) {
        return `${m1}/assets/${m2}.css`;
    }

    const babelConfig = getCommonBabelConfig(modules);
    let stream = js.pipe(babel(babelConfig));
    const lessPath = new RegExp(`(["'])/([^.'"]+)/index.less`, 'g');
    return stream
        .pipe(
            through2.obj(function(file, encoding, next) {
                const contents = file.contents.toString(encoding).replace(lessPath, replacer);
                file.contents = Buffer.from(contents);
                this.push(file);
                next();
            })
        )
        .pipe(gulp.dest(modules !== false ? 'lib' : 'es'));
}

gulp.task('js', () => {
    console.log('[Parallel] compile js...');
    del(['lib']);
    return babelify();
});

gulp.task('es', () => {
    console.log('[Parallel] compile es...');
    del(['es']);
    return babelify(false);
});

gulp.task(
    'dist',
    gulp.series(done => {
        del(['dist']);
        const entry = '../index';
        if (!entry) {
            done();
            return;
        }
        let webpackConfig;
        const buildFolder = path.join(cwd, 'dist/');
        if (fs.existsSync(path.join(cwd, 'webpack.config.js'))) {
            webpackConfig = require(path.join(cwd, 'webpack.config.js'))(
                getWebpackConfig({
                    common: false,
                    inlineSourceMap: false,
                    prod: true
                }),
                { phase: 'dist' }
            );
        } else {
            webpackConfig = Object.assign(
                getWebpackConfig({
                    common: false,
                    inlineSourceMap: false,
                    prod: true
                }),
                {
                    output: Object.assign(
                        {
                            path: buildFolder,
                            libraryTarget: 'umd',
                            libraryExport: 'default',
                            library: 'byj'
                        },
                    ),
                    optimization:{
                        minimizer: [
                            new OptimizeCSSAssetsPlugin({
                                assetNameRegExp: /\.css$/g,
                                cssProcessor: require('cssnano'),
                                // cssProcessorOptions: cssnanoOptions,
                                cssProcessorPluginOptions: {
                                    preset: ['default', {
                                        discardComments: {
                                            removeAll: true,
                                        },
                                        normalizeUnicode: false
                                    }]
                                },
                                canPrint: true
                            }),
                            new UglifyJsPlugin({
                                include: /\.js$/,
                                parallel: true,
                                uglifyOptions: {
                                    output: {
                                        comments: false,
                                    },
                                }
                            })
                        ]
                    },
                    mode: 'production',
                    externals: {
                        react: {
                            root: 'React',
                            commonjs2: 'react',
                            commonjs: 'react',
                            amd: 'react',
                        },
                        'react-dom': {
                            root: 'ReactDOM',
                            commonjs2: 'react-dom',
                            commonjs: 'react-dom',
                            amd: 'react-dom',
                        },
                    },
                }
            );
            webpackConfig.plugins.concat([
                new webpack.DefinePlugin({
                    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
                })
            ]);
            webpackConfig.entry = entry;
            webpackConfig = [webpackConfig];
        }
        webpack(webpackConfig, (err, stats) => {
            if (err) {
                console.error('error', err);
            }
            done(err);
        });
    })
);

gulp.task('eslint', () => {
    return gulp.src('../components/**/*.js')
        .pipe(eslint({
            rules: {
                'my-custom-rule': 1,
                'strict': 2
            },
            globals: [
                'jQuery',
                '$'
            ],
            envs: [
                'browser'
            ]
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError('failes'));
});

gulp.task('deploy',  function() {
    gulp.src(['lib/**/*', 'es/**/*', 'dist/**/*'], { base: '.' })
        .pipe(gulp.dest('../output'))
    return del(['./lib', './es', './dist']);
});