const entry = require('webpack-glob-entry');
const path = require('path');
const parsePath = require('parse-filepath');
const package = require('./package.json');

distPath = parsePath(package.script);

module.exports = {
	mode: 'production',
	entry: entry('./src/js/index.js'),
	output: {
		filename: distPath.basename ? distPath.basename : '[name].js',
		path: path.resolve(__dirname, 'dist'),
		library: package.library,
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