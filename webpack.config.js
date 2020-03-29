const entry = require('webpack-glob-entry');
const path = require('path');
const pkg = require('./package.json');

module.exports = {
	mode: 'production',
	entry: entry('./src/js/index.js'),
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),
		library: pkg.library,
		libraryTarget: 'umd',
        libraryExport: 'default',
        umdNamedDefine: true
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader'
			}
		]
	},
    optimization: {
        minimize: false
    }
};