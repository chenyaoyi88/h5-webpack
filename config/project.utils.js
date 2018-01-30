/**
 * 替换 html 文本
 *
 * @param {any} oReg 替换的数组
 * @param {any} str 字符串
 * @returns
 */
function replaceHtml(aReg, str) {
  let strNew = str;
  for (let item of aReg) {
    strNew = strNew.replace(new RegExp(item.reg, 'gi'), function(s) {
      return item.text;
    });
  }
  return strNew;
}

exports.replaceHtml = replaceHtml;
