const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TARGET = process.env.npm_lifecycle_event || 'build'

const developmentConfig = require('./webpack/dev')

let common = {
    entry: {
        app: path.resolve(__dirname, "src"),
    },
    output: {
        path: path.resolve(__dirname, "build/dist"),
        filename:'[name].bundle.js',
        chunkFilename: "[name].bundle.js",
        publicPath: "/build/dist/",
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        modules: true
                    }
                }
            },
            {
                test: /\.ts(x?)$/,
                use: [
                    {
                        loader: 'babel-loader'
                    },
                    {
                        loader: 'ts-loader'
                    }
                ]
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: ['style-loader'],
                    use:[
                        {
                            loader:"css-loader",
                            query: {
                                modules: true,
                                importLoaders: 1,
                                localIdentName : '[name]__[local]___[hash:base64:5]'
                            }
                        },
                        {
                            loader: "postcss-loader"
                        }
                    ],
                    publicPath: "build/dist" // Overrides output.publicPath
                })
            }
        ]
    },
    resolve: {
        extensions: [".css", ".tsx", ".ts", ".js"],
        modules: [
            path.resolve(__dirname, "src"),
            "node_modules"
        ]
    },
    plugins: [
        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)@angular/,
            path.resolve(__dirname, 'src')
        ),
        new webpack.LoaderOptionsPlugin({
            options:{
                postcss: [
                    autoprefixer({ browsers: ['last 2 versions'] })
                ],
            }
        }),
        new ExtractTextPlugin({
            filename:'[name].bundle.css',
            disable:false,
            allChunks:true
        }),
        new CopyWebpackPlugin([
            {from: 'src/assets', to: '../assets'},
            {from: 'src/index.html', to: '../index.html'}
        ])
    ]
};

let config = common

if (TARGET === 'build') {
    config = merge.smart(common, {
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('production')
                }
            }),
            new webpack.LoaderOptionsPlugin({
                minimize: true,
                debug: false
            }),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                    screw_ie8: true,
                    conditionals: true,
                    unused: true,
                    comparisons: true,
                    sequences: true,
                    dead_code: true,
                    evaluate: true,
                    if_return: true,
                    join_vars: true,
                },
                output: {
                    comments: false
                },
            })
        ]
    })
}



if ((TARGET === 'start') || (TARGET === undefined)) {
    config = merge(common, {
        debug: true,
        plugins: [],
        devtool: 'eval'
    })

    config = merge(common, developmentConfig.devServer())
}

module.exports = config