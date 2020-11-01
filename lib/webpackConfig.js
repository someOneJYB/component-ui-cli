'use strict';

const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const getWebpackCommonConfig = require('./getWebpackCommonConfig');
const resolveCwd = require('./resolveCwd');

function getEntry() {
    const exampleDir = resolveCwd('components');
    const files = fs.readdirSync(exampleDir);
    const entry = {};
    files.forEach(file => {
        const extname = path.extname(file);
        const name = path.basename(file, extname);
        if (extname === '.js' || extname === '.jsx' || extname === '.tsx' || extname === '.ts') {
            const htmlFile = path.join(exampleDir, `${name}.html`);
            if (fs.existsSync(htmlFile)) {
                entry[`components/${name}`] = [`./components/${file}`];
            }
        }
    });
    return entry;
}


module.exports = ({ common, inlineSourceMap, prod }) => {
    const plugins = [];
    plugins.push(new MiniCssExtractPlugin());
    const config = {
        mode: prod ? 'production' : 'development',
        devtool: inlineSourceMap ? '#inline-source-map' : '#source-map',

        resolveLoader: getWebpackCommonConfig.getResolveLoader(),

        // entry: getEntry(),

        output: {
            path: resolveCwd('dist'),
            filename: '[name].js',
        },

        module: {
            noParse: [/moment.js/],
            rules: getWebpackCommonConfig.getLoaders().concat(getWebpackCommonConfig.getCssLoaders(prod ? true : false)),
        },

        resolve: getWebpackCommonConfig.getResolve(),

        plugins,
    };

    if (common) {
        config.optimization = {
            splitChunks: {
                cacheGroups: {
                    commons: {
                        name: 'common',
                        chunks: 'initial',
                        minChunks: 2,
                    },
                },
            },
        };
    }

    return config;
};
