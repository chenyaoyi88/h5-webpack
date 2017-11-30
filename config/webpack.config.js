const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const IP = require('ip').address();

const DIR = {
    STATIC_FLODER: '../dist/',
    SRC_FLODER: '../src/'
};

console.log(process.env.NODE_ENV);

module.exports = {
    entry: {
        app: './src/js/index.js',
        print: './src/js/print.js'
    },
    output: {
        filename: './js/' + '[name].bundle.js',
        path: path.resolve(__dirname, DIR.STATIC_FLODER)
    },
    // inline-source-map 用于开发环境，生产环境要换
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, DIR.SRC_FLODER),
        // 一切服务都启用gzip 压缩
        compress: true,
        port: 9000,
        clientLogLevel: 'none',
        historyApiFallback: true,
        // host 设置为本机 ip 
        host: IP,
        // 热替换特性
        hot: true,
        // 启用 noInfo 后，诸如「启动时和每次保存之后，那些显示的 webpack 包(bundle)信息」的消息将被隐藏。错误和警告仍然会显示。
        noInfo: true,
        // 编译出错时，全屏覆盖
        overlay: true,
        // 启用 quiet 后，除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自 webpack 的错误或警告在控制台不可见
        quiet: true
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ],
				exclude: /node_modules/ //include/exclude 添加必须处理/屏蔽不需要处理 (文件或文件夹)
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
            }
        ],
    },
    plugins: [
        // 清空之前生成的文件夹
        new CleanWebpackPlugin([DIR.STATIC_FLODER]),
        new FriendlyErrorsPlugin(),
		new webpack.HotModuleReplacementPlugin(), //热加载插件
        new HtmlWebpackPlugin({
            favicon: path.resolve(__dirname, DIR.SRC_FLODER, 'favicon.ico'),
            // 模版 html 路径
            template: path.resolve(__dirname, DIR.SRC_FLODER, 'index.html'),
            // true 在 body 插入
            inject: true,
            // 页面上的资源加哈希（不是文件加）
            hash: true
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
		// new HtmlWebpackPlugin({
		// 	template: 'html-withimg-loader!' + __dirname + '/src/index.tmpl.html' //HtmlWebpackPlugin 配合 html-withimg-loader 打包html输出
		// }),
    ],
};