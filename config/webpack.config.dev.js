const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const IP = require('ip').address();
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
    devtool: 'cheap-module-eval-source-map',
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    devServer: {
        contentBase: path.resolve(__dirname, PROJECT.PATH.SRC),
        // 一切服务都启用gzip 压缩
        compress: true,
        port: 9000,
        // 当使用内联模式(inline mode)时，在开发工具(DevTools)的控制台(console)将【bu】显示消息
        clientLogLevel: 'none',
        // 当使用HTML5 History API，任意的 404 响应可以提供为 index.html 页面
        historyApiFallback: true,
        // host 设置为本机 ip 
        host: IP,
        // 热替换特性
        inline: true,
        hot: true,
        // 启用 noInfo 后，诸如「启动时和每次保存之后，那些显示的 webpack 包(bundle)信息」的消息将被隐藏。错误和警告仍然会显示。
        noInfo: true,
        // 编译出错时，全屏覆盖
        overlay: true,
        // 启用 quiet 后，除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自 webpack 的错误或警告在控制台不可见
        quiet: true,
        // 自动打开浏览器
        open: true
    },
    module: {
        rules: [{
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader"
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader'
                ],
                exclude: /node_modules/ //include/exclude 添加必须处理/屏蔽不需要处理 (文件或文件夹)
            }, {
                test: /\.scss$/,
                use: [{
                    loader: "style-loader" // 将 JS 字符串生成为 style 节点
                }, {
                    loader: "css-loader" // 将 CSS 转化成 CommonJS 模块
                }, {
                    loader: "sass-loader" // 将 Sass 编译成 CSS
                }, {
                    loader: "postcss-loader" // 加前缀
                }]
            },
            {
                test: /\.(png|svg|gif|jpe?g)$/, //处理所有资源内url指向的文件，打包输出到原来的相对路径
                use: {
                    loader: "file-loader", //file-loader
                    options: {
                        name: "[name].[ext]",
                        outputPath: "images/"
                    }
                },
                exclude: /node_modules/
            }, {
                test: /\.html$/,
                loader: "raw-loader" 
            }
        ],
    },
    plugins: [
        new FriendlyErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin(), //热加载插件,
        new HtmlWebpackPlugin({
            favicon: path.resolve(__dirname, PROJECT.PATH.SRC, 'favicon.ico'),
            // 模版 html 路径
            template: path.resolve(__dirname, PROJECT.PATH.SRC, 'index.html'),
            // true 在 body 插入
            inject: true,
            // 页面上的资源加哈希（不是文件加）
            hash: true,
            cache: false
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(PROJECT.ENV.DEV)
            }
        })
    ],
};