const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const PROJECT = require('./project.config');

console.log(process.env.NODE_ENV);

module.exports = {
    entry: {
        'index': './src/ts/index.ts'
    },
    output: {
        filename: './js/[name].bundle.js',
        path: path.resolve(__dirname, PROJECT.PATH.DIST)
    },
    devtool: 'cheap-module-source-map',
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    module: {
        rules: [{
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader'
                ],
                exclude: /node_modules/ 
            }, {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader', 
                        'sass-loader',
                        'postcss-loader'
                    ]
                }),
                exclude: /node_modules/ 
            },
            {
                test: /\.(png|svg|gif|jpe?g)$/, 
                use: {
                    loader: "file-loader", 
                    options: {
                        name: "[name].[hash].[ext]",
                        outputPath: "images/"
                    }
                },
                exclude: /node_modules/
            }
        ],
    },
    plugins: [
        // 清空之前生成的文件夹
        new CleanWebpackPlugin([PROJECT.PATH.DIST]),
        new FriendlyErrorsPlugin(),
        new ExtractTextPlugin({
         filename: 'css/style.css'
        }),
        new HtmlWebpackPlugin({
            favicon: path.resolve(__dirname, PROJECT.PATH.SRC, 'favicon.ico'),
            // 模版 html 路径
            template: path.resolve(__dirname, PROJECT.PATH.SRC, 'index.html'),
            // true 在 body 插入
            inject: true,
            // 页面上的资源加哈希（不是文件加）
            hash: true
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(PROJECT.ENV.PROD)
            }
        })
    ],
};