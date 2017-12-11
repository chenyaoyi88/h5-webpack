const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PROJECT = require('./project.config');
const colors = require('colors');

const ENV = process.env.NODE_ENV;
let envText = '--';

switch (ENV) {
    case 'development':
        envText = '开发环境';
        PROJECT.PUBLIC_PATH = '/';
        PROJECT.OUTPUT = PROJECT.PATH.DEV;
        break;
    case 'test':
        envText = '测试环境';
        PROJECT.PUBLIC_PATH = '//sit.guanghuobao.com/ghb-web/' + PROJECT.NAME;
        PROJECT.OUTPUT = PROJECT.PATH.TEST;
        break;
    case 'production':
        envText = '生产环境';
        PROJECT.PUBLIC_PATH = '//www.guanghuobao.com/ghb-web/' + PROJECT.NAME;
        PROJECT.OUTPUT = PROJECT.PATH.PROD;
        break;
};

console.log('****************************'.yellow);
console.log('当前打包环境：'.rainbow + envText.green + '(' + ENV.cyan + ')');
console.log('****************************'.yellow);

module.exports = {
    entry: {
        // 主逻辑 js 
        'index': './src/ts/index.ts',
        // 第三方库或者工具
        'vendor': './src/vendor/vendor.ts'
    },
    output: {
        filename: './js/[name].[hash:8].bundle.js',
        // 最后打包输出的文件夹位置
        path: path.resolve(__dirname, PROJECT.OUTPUT),
        // sourcemap文件的名字，必须和devtool一起来使用
        sourceMapFilename: './js/[name].[hash:8].bundle.map',
    },
    devtool: 'cheap-module-source-map',
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    module: {
        rules: [
            // 处理 typescript 文件
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            }, {
                // 处理 scss 文件
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        'css-loader?minimize&sourceMap',
                        'postcss-loader?sourceMap',
                        'sass-loader?sourceMap',
                    ],
                    // 当SCSS未被提取时使用
                    fallback: 'style-loader'
                }),
                exclude: /node_modules/
            },
            {
                // 处理 css 文件
                test: /\.css$/,
                // 提取 css
                use: ExtractTextPlugin.extract({
                    use: [
                        'css-loader?minimize&sourceMap',
                        'postcss-loader?sourceMap'
                    ],
                    // 当CSS未被提取时使用
                    fallback: 'style-loader'
                }),
                exclude: /node_modules/
            },
            {
                // 处理图片
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[hash:8].[ext]',
                        // 抽取出来放在 images 文件夹里面
                        outputPath: 'images/',
                        // scss 文件背景图路径要以根目录作为参考起点
                        publicPath: PROJECT.PUBLIC_PATH,
                        // 图片在非开发模式下使用相对路径
                        // useRelativePath: ENV === 'development' ? false : true
                    }
                }, {
                    // 压缩图片
                    loader: 'image-webpack-loader',
                    options: {
                        mozjpeg: {
                            quality: 100
                        },
                        optipng: {
                            optimizationLevel: 7
                        },
                        pngquant: {
                            quality: 100
                        },
                        gifsicle: {
                            interlaced: false,
                        },
                        webp: {
                            quality: 75
                        }
                    }
                }],
                exclude: /node_modules/
            }, {
                // 处理 html 里面用 img 标签的图片，不然打包的时候不会处理 
                test: /\.html$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        minimize: true
                    }
                },
                exclude: /node_modules/
            }
        ],
    },
    plugins: [
        new FriendlyErrorsPlugin(),
        // 通过 ExtractTextPlugin 把 css 抽离出来，生成一个独立的 css 文件再页面上引入
        new ExtractTextPlugin({
            filename: 'css/index.[contenthash].css'
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
        // 压缩js
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            comments: false,
            mangle: {
                keep_fnames: true,
                screw_ie8: true
            },
            compress: {
                screw_ie8: true,
                warnings: false,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true,
                negate_iife: false,
                drop_debugger: true,
                drop_console: true
            },
            compressor: {
                warnings: false
            }
        }),
        // 将代码拆分成【应用代码】和【公共代码】
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            // filename: "vendor.js"
            // (给 chunk 一个不同的名字)
            minChunks: Infinity,
            // (随着 entry chunk 越来越多，
            // 这个配置保证没其它的模块会打包进 vendor chunk)
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(ENV)
            }
        })
    ]
};