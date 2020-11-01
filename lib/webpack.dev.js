const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const getWebpackConfig = require('./webpackConfig');

const dirname = process.cwd();

module.exports = {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        host: '127.0.0.1',  // 我们可以允许我们用任意方式进行访问（127.0.0.1，localhost, 本机ip）
        port: '8878',
        contentBase: path.resolve(dirname, 'build'),
        hot: true,
        open: true,
        historyApiFallback: true,
    },
    ...getWebpackConfig({common: false, inlineSourceMap: true, prod: false}),
    entry: [dirname+'/public/index.js'],
    output: {
        path: path.resolve(dirname, 'build'),
        filename: '[name].bundle.[hash:8].js',
        publicPath: '/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(dirname, 'public/index.html')
        })
    ],
}