import {stringify} from 'qs';
import {fetch} from 'dva';


/**
 *
 * @param url  请求路径
 * @param params 请求参数
 * @param flag  是否以body体的形式传参
 * @returns {Promise<any | never>}
 */
export default function post(url, params, flag) {
  const defaultOptions = {
    // credentials: "include",
    method: 'POST',
    body: params || {},
  };
  const newOptions = {...defaultOptions};
  if (flag) {
    newOptions.headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=utf-8'
    };
    newOptions.body = JSON.stringify(newOptions.body);
  } else {
    newOptions.headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    newOptions.body = stringify(newOptions.body);
  }
  return fetch(url, newOptions)
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response;
      }
      throw new Error("请求错误，请联系系统管理员！");
    })
    .then(response => response.json())
    .catch(() => {
    });
}
