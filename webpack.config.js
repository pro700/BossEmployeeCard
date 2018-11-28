// Rewrite webpack config if needed, aka "eject"

const { join } = require('path');
const { DefinePlugin } = require('webpack');
const configs = require('sp-build-tasks/dist/webpack/config');

require('dotenv').load();

const defineOptions = {
  APP_CONFIG: JSON.stringify(
    require(join(process.cwd(), process.env.APP_JSON || './config/app.json'))
  )
};

configs.forEach(config => {
  
  //config.module.rules.push({ test: /\.scss$/, use: 'scss-loader' });
  //config.module.rules.push({ test: /\.css$/, use: 'css-loader' });
  //config.module.rules.push({ 
  //  test: /\.ts$/, 
  //  exclude: /(node_modules|dist)/, 
  //  use: 'awesome-typescript-loader' 
  //});

  config.module.rules.push({
    test: /\.(gif|png|jpe?g)$/,
    use: {
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: '../images/',
        emitFile: true
      }
    }
  });

  config.module.rules.push({
    test: /\.woff|\.woff2|\.svg|\.eot|\.ttf/i,
    use: {
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: '../fonts/',
        emitFile: true
      }
    }
  });

  /*
  test: /\.(gif|png|jpe?g|svg)$/,
  use: {
    loader: 'file-loader',
    options: {
      name: '[name].[ext]',
      outputPath: '../images/',
      emitFile: false
    }
  }
  */

  
  
  // Define plugin
  config.plugins = config.plugins || [];
  config.plugins.push(new DefinePlugin(defineOptions));

  // Exclude "heavy" 3rd parties
  config.externals = Object.assign(config.externals || {}, {
    '@pnp/sp': 'pnp',
    'react': 'React',
    'react-dom': 'ReactDOM',
    'bootstrap': 'bootstrap',
    'jquery': 'jQuery',
    'jstree': 'jsTree'
    //'moment': 'moment',
  });

});

module.exports = configs;