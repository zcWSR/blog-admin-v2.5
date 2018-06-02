import React from 'react';
import axios from 'axios';
import msgbox from '../components/message-box';

axios.interceptors.response.use((response) => {
  if (response.config.noResponseUnpack) {
    return response;
  }
  const result = response.data;
  result.httpResponse = response;
  if (!result.ret) {
    result.isNotHttpError = true;
    throw result;
  }
  return result;
});
// 如果与上一个合并，那么上一个函数中的reject将不会被以下代码catch到
axios.interceptors.response.use(null, (error) => {
  const config = error.isNotHttpError ? error.httpResponse.config : error.config;
  if (config.noHandleError) {
    return Promise.reject(error);
  } else if (error.isNotHttpError) {
    msgbox.showMessage((
      <div>
        <p>错误代码：{error.errcode}</p>
        { error.errmsg ? <p>错误信息：{error.errmsg}</p> : '' }
      </div>
    ), '错误')
    .ok(() => {
      if (error.errcode === -2) {
        window.location = '/#/login';
      }
    });
  } else {
    msgbox.showMessage(`服务器发生错误：${error.errmsg}`);
  }
  return Promise.reject(error);
});
