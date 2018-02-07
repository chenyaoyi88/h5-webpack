

interface Ajax<T> {
  // 请求类型
  type: string;
  // 提交的 url 
  url: string;
  //  提交的数据对象
  data?: T;
  //  请求超时时间
  timeout?: number;
  //  需要设置的请求头
  headers?: any;
  //  请求成功回调
  success?: Function;
  //   请求失败回调
  error?: Function;
}

function json2url(json: { t: number }): string {
  json.t = Math.random();
  var arr = [];
  for (var name in json) {
    arr.push(name + '=' + encodeURIComponent(json[name]));
  }
  return arr.join('&');
}

/**
 * @description 自己封装的简单 ajax
 * @param {*Object} options ajax 选项
 * @returns {Promise}
 * url 提交的 url
 * data 提交的数据对象
 * timeout 请求超时时间
 * header 需要设置的请求头
 * success 请求成功回调
 * error 请求失败回调
 */
function ajax(options: Ajax<any>): Promise<any> {
  if (!options.url) {
    return;
  }

  options.data = options.data || {};
  options.type = options.type || 'GET';
  options.timeout = options.timeout || 0;
  options.headers = options.headers || {};

  let xhr = null;
  let timer = null;

  //1 创建
  xhr = new XMLHttpRequest();

  if (options.type.toUpperCase() === 'GET') {
    xhr.open('GET', options.url + '?' + json2url(options.data), true);
    if (options.headers) {
      for (let pro in options.headers) {
        xhr.setRequestHeader(pro, options.headers[pro]);
      }
    }
    xhr.send();
  } else {
    xhr.open('POST', options.url, true);
    if (options.headers) {
      for (let pro in options.headers) {
        xhr.setRequestHeader(pro, options.headers[pro]);
      }
    } else {
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    if (typeof options.data === 'string') {
      xhr.send(options.data);
    } else {
      xhr.send(json2url(options.data));
    }
  }

  xhr.onreadystatechange = function () {
    // 完成
    if (xhr.readyState === 4) {
      clearTimeout(timer);
      // 成功
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
        options.success && options.success(JSON.parse(xhr.responseText));
      } else {
        //失败
        options.error && options.error('error');
      }
    }
  };

  if (options.timeout) {
    timer = setTimeout(function () {
      options.error && options.error('timeout');
      xhr.abort();
    }, options.timeout);
  }
}

export { ajax };
