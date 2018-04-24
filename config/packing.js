/**
 * 这个文件可以修改packing配置文件的默认设置
 * 默认配置请看 `node_modules/packing/config/packing.js`
 *
 * @param object packing 默认配置对象
 */

import path from 'path';
import packingGlob from 'packing-glob';

export default (packing) => {
  const p = packing;
  // 模版引擎类型，目前支持的类型有[html,pug,ejs,handlebars,smarty,velocity,artTemplate]
  p.templateEngine = 'html';
  // 模版文件扩展名
  p.templateExtension = '.html';

  // 网站自定义配置
  p.hot = true;
  p.sourceMap = true;

  // 开启css-modules
  // p.cssModules = true;
  // p.cssModulesIdentName = '[name]-[local]-[hash:base64:5]';

  p.commonChunks = {
    vendor: [
      'react',
      'react-dom',
      'mobx',
      'mobx-react',
      'classnames',
      'element-resize-event',
      'echarts',
      'moment',
      'tiny-cookie',
      'axios'
    ]
  };

  p.path.entries = () => {
    const entryFileName = 'entry.js';
    const entryPath = 'src/pages';
    const entryPattern = `**/${entryFileName}`;
    const cwd = path.resolve(entryPath);
    const config = {};
    packingGlob(entryPattern, { cwd }).forEach((page) => {
      const key = page.replace(entryFileName, 'index');
      config[key] = path.join(cwd, page);
    });
    return config;
  };

  p.rewriteRules = {
    // 网站URL与模版的对应路由关系
    '^/$': '/index.html',
    // API转发
    '^/api/(.*)': 'http://zcwsr.com:2333/$1'
  };

  return p;
};
