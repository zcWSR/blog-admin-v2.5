/**
 * 这个文件可以修改build的默认设置
 * 默认配置请看 `node_modules/packing/config/webpack.build.babel.js`
 *
 * @param object webpackConfig 默认配置对象
 * @param object program packing-cli程序对象
 * @param object appConfig config/packing.js中的配置
 */

import webpack from 'webpack';

export default (webpackConfig) => {
  const config = webpackConfig;

  if (!config.resolve.alias) {
    config.resolve.alias = {};
  }

  config.plugins.push(new webpack.DefinePlugin({
    'process.node_env': {
      BUILD_IN_DEVELOPMENT: JSON.stringify(process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'beta')
    }
  }));

  return config;
};
