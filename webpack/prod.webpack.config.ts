import * as Base from './base';
import * as webpack from 'webpack';

const prodConfig: webpack.Configuration = {
  ...Base.getConfig('prod'),
  plugins: Base.getPlugins('prod'),
  module: {
    rules: Base.getRules('prod')
  }
};

export default prodConfig;