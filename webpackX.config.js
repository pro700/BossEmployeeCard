var webpack = require("webpack");
//var awesome_typescript_loader_1 = require("awesome-typescript-loader");
//var path = require("path");
//var fs = require("fs");

module.exports = {
  entry: './src/scripts/index.ts',
  output: {
    filename: 'scripts/app.js',
    path: __dirname + '/dist'
  },
  mode: 'production',
  externals: {
      //'moment': 'moment',
      '@pnp/sp': 'pnp',
      'react': 'React',
      'react-dom': 'ReactDOM',
      'bootstrap': 'bootstrap',
      'jquery': 'jQuery',
      'jstree': 'jsTree'
    },
  module: {
    rules: [
      { test: /\.scss$/, use: 'scss-loader' },
      { test: /\.css$/, use: 'css-loader' },
      { 
        test: /\.ts$/, 
        exclude: /(node_modules|dist)/, 
        use: 'awesome-typescript-loader' 
      },
      { 
        test: /\.woff|\.woff2|\.svg|\.eot|\.ttf/i, 
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: '../dist/fonts/',
            emitFile: true
          }
        } 
      },
      { 
        test: /\.(gif|png|jpe?g)$/, 
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: '../dist/images/',
            emitFile: true
          }
        } 
      }
    ]
  }
};