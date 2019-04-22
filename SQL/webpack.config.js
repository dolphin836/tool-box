const path                    = require('path');
const ExtractTextPlugin       = require("extract-text-webpack-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin       = require('html-webpack-plugin');
const CleanWebpackPlugin      = require('clean-webpack-plugin');
const WebpackBar              = require('webpackbar');

module.exports = {
    entry: './src/SQL.js',
    output: {
        filename: 'SQL.[chunkhash].js',
        path: path.resolve(__dirname, 'dist'),
        hashDigestLength: 8
    },
    devServer: {
        contentBase: './dist'
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        'sass-loader'
                    ]
                })
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new ExtractTextPlugin('SQL.[chunkhash].css'),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: ['default', { discardComments: { removeAll: true } }],
            },
            canPrint: true
        }),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            filename: '../index.html'
        }),
        new WebpackBar()
    ]
};