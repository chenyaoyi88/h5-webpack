var HOST = window.location.host;
var API = '';
if (HOST.includes('sit')) {
    // 测试环境
    API = '//sit.guanghuobao.com';
} else if (HOST.includes('www')) {
    API = '//www.guanghuobao.com';
} else {
    // 你的 ip 
    API = '//10.2.10.227';
    // API = '//127.0.0.1:4000';
}
console.log(API);

function json2url(json) {
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
function ajax(options) {
    options = options || {};
    if (!options.url) {
        return;
    }

    options.data = options.data || {};
    options.type = options.type || 'GET';
    options.timeout = options.timeout || 0;
    options.header = options.header || {};

    let xhr = null;
    let timer = null;
    const str = json2url(options.data);

    //1 创建
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }

    if (options.type.toUpperCase() === 'GET') {
        xhr.open('GET', options.url + '?' + str, true);
        xhr.send();
    } else {
        xhr.open('POST', options.url, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        for (let pro in options.header) {
            xhr.setRequestHeader(pro, options.header[pro]);
        }
        xhr.send(str);
    }

    return new Promise((resolve, reject) => {
        xhr.onreadystatechange = function () {
            // 完成
            if (xhr.readyState === 4) { 
                clearTimeout(timer);
                // 成功
                if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                    options.success && options.success(JSON.parse(xhr.responseText));
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    //失败
                    options.error && options.error('error');
                    reject('error');
                }

            }
        };

        if (options.timeout) {
            timer = setTimeout(function () {
                reject('timeout');
                // 终止
                xhr.abort();
            }, options.timeout);
        }
    });

}

/**
 * toast 显示
 * @param {*String} text 要显示的文本内容
 */
const toast = function (text) {
    if (document.getElementById('toast')) {
        return false;
    }

    const doc = document.body;
    const toastText = text;

    doc.insertAdjacentHTML(
        'beforeEnd',
        `<div class='toast' id='toast'>
                <div class='toast-wrap'>
                    <div class='toast-content'>${toastText}</div>
                </div>
            </div>`
    );

    var oToast = document.getElementById('toast');
    var oToastText = oToast.querySelector('.toast-content');

    oToastText.classList.add('slideInUp', 'animated');

    oToastText.addEventListener('webkitAnimationEnd', function () {
        doc.removeChild(oToast);
    });
}