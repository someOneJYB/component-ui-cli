'use strict';

const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const assign = require('object-assign');
const getBabelCommonConfig = require('./getCommonBabelConfig');
const getTSCommonConfig = require('./getTSCommonConfig');

const tsConfig = getTSCommonConfig();
const cwd = process.cwd();

function getResolve() {
  const alias = {};
  const resolve = {
    modules: [cwd, 'node_modules'],
    extensions: ['.web.ts', '.web.tsx', '.web.js', '.web.jsx', '.ts', '.tsx', '.js', '.jsx'],
    alias,
  };
  return resolve;
}

const postcssLoader = {
  loader: 'postcss',
  options: { plugins: require('./postcssConfig') },
};

module.exports = {
  getResolve,
  getResolveLoader() {
    return {
      modules: [
        path.resolve(__dirname, '../node_modules'),
        path.resolve(__dirname, '../../'),
      ],
      moduleExtensions: ['-loader'],
    };
  },
  getLoaders(c) {
    const commonjs = c || false;
    const babelConfig = getBabelCommonConfig(commonjs);
    const babelLoader = {
      loader: 'babel',
      options: babelConfig,
    };
    return [
      assign(
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
        },
        babelLoader
      ),
      {
        test: /\.svg$/,
        loader: 'svg-sprite',
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          babelLoader,
          {
            loader: 'ts',
            options: {
              transpileOnly: true,
              configFile: getTSCommonConfig.getConfigFilePath(),
              compilerOptions: tsConfig,
            },
          },
        ],
      },
      // Needed for the css-loader when [bootstrap-webpack](https://github.com/bline/bootstrap-webpack)
      // loads bootstrap's css.
      {
        test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url',
        options: {
          limit: 720000,
          minetype: 'application/font-woff',
        },
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url',
        options: {
          limit: 720000,
          minetype: 'application/octet-stream',
        },
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file',
      },
      {
        test: /\.(png|jpg|jpeg|webp)$/i,
        loader: 'file',
        options:{ // 这里的options选项参数可以定义多大的图片转换为base64
          limit:72000, // 表示小于50kb的图片转为base64,大于50kb的是路径
          outputPath:'images' //定义输出的图片文件夹
        }

      },
    ];
  },
  getCssLoaders(extractCss) {
    let cssLoader = [
      {
        loader: 'css-loader',
        options: {
          importLoaders: 1,
          sourceMap: true,
        },
      },
      postcssLoader,
    ];
    let lessLoader = cssLoader.concat([
      {
        loader: 'less-loader',
        options: {
          sourceMap: true,
        },
      },
    ]);
    if (extractCss) {
      cssLoader = [MiniCssExtractPlugin.loader].concat(cssLoader);
      lessLoader = [MiniCssExtractPlugin.loader].concat(lessLoader);
    } else {
      const styleLoader = {
        loader: 'style-loader',
      };
      cssLoader.unshift(styleLoader);
      lessLoader.unshift(styleLoader);
    }
    return [
      {
        test: /\.css$/,
        use: cssLoader,
      },
      {
        test: /\.less$/,
        use: lessLoader,
      },
    ];
  },
};
