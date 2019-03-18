let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let MiniCssExtractPlugin = require('mini-css-extract-plugin');
let OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
let UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
let webpack = require('webpack');
let Happypack = require('happypack');
module.exports = {
    optimization:{
        minimizer:[
            new OptimizeCssAssetsWebpackPlugin({}),
            new UglifyjsWebpackPlugin({
                cache:true,
                parallel:true,
                sourceMap:true
            })
        ]
    },
    mode:"production",
    entry:"./src/index.js",
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:"bundle.js",
        // publicPath:"http://loaclhost:3000"
    },
    devServer:{
        port:"3000",
        progress:true,
        contentBase:'./dist',
        compress:true
    },
    externals:{
        jquery:"jQuery"
    },
    plugins:[
        new Happypack({
            id:'js',
            use:[
                {
                    loader:'babel-loader',
                    options:{
                        presets:['@babel/preset-env'],
                        plugins:['@babel/plugin-syntax-dynamic-import']
                    }
                }
            ]
        }),
        new HtmlWebpackPlugin({
            template:'./src/index.html',
            filename:"index.html",
            hash:true,
            minify:{
                removeAttributeQuotes:true,
                collapseWhitespace:true
            }
        }),
        new MiniCssExtractPlugin({
            filename:"css/main.css"
        }),
        new webpack.ProvidePlugin({
            $:'jquery'
        })
    ],
    module:{
        rules:[
            {
                test:/\.js$/,
                use:'happypack/loader?id=js'
            },
            {
                test:/\.html$/,
                use:'html-withimg-loader'
            },
            {
                test:/\.(jpg|png|gif)$/,
                // use:'file-loader'
                use:{
                    loader:"url-loader",
                    options:{
                        limit:1,
                        outputPath:'/img/',
                        // publicPath:"http://loaclhost:3000"
                    }
                }
            },
            {
                // test:require.resolve('jquery'),
                // use:'expose-loader?$'
            },
            {
                test:'/\.js$/',
                loader:'eslint-loader',
                options:{
                    enforce:'pre'
                }
            },
            // {
            //     test:/\.js$/,
            //     // use:{
            //     //     loader:'babel-loader',
            //     //     options:{
            //     //         presets:['@babel/preset-env'],
            //     //         plugins:[
            //     //             ["@babel/plugin-proposal-decorators", { "legacy": true }],
            //     //             ["@babel/plugin-proposal-class-properties", { "loose" : true }],
            //     //             "@babel/plugin-transform-runtime",
            //     //             // "@babel/runtime"
            //     //         ]
            //     //     }
            //     // },
            //     use:"babel-loader",
            //     include:path.resolve(__dirname,'src'),
            //     exclude:/node_modules/
            // },
            {
                test:/.css$/,
                use:[
                    // {
                    //     loader:'style-loader',
                    //     options:{
                    //         insertAt:'top'
                    //     }
                    // },
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader' 
                ]
            }
        ]
    }
}