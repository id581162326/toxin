import * as Base from './base';
import * as webpack from 'webpack';

const devConfig: webpack.Configuration = {
  ...Base.getConfig('dev'),
  plugins: Base.getPlugins('dev'),
  module: {
    rules: Base.getRules('dev')
  }
};

export default devConfig;