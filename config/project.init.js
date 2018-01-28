const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs-extra'));;
const path = require('path');
const colors = require('colors');
const PROJECT = require('./project.config');
const config = require('../config.json');

const project_html = 'index.html';
const indexHtml = path.resolve(__dirname, PROJECT.PATH.SRC, project_html);

// 要替换的标题、描述和关键字
const oReg = {
    '^{title}^': config.title,
    '^{description}^': config.description,
    '^{keywords}^': config.keywords
};

const sIndexHtml = fs.readFileSync(indexHtml, 'utf-8');
const newIndexHtml = replaceHtml(oReg, sIndexHtml);

fs.writeFileSync(indexHtml, newIndexHtml, 'utf-8');

console.log('初始化完成'.green);

/**
 * 替换 html 文本
 * 
 * @param {any} oReg 替换的键值对
 * @param {any} str 字符串
 * @returns 
 */
function replaceHtml(oReg, str) {
    let strNew = str;
    for (let name in oReg) {
        strNew = strNew.replace(name, oReg[name]);
    }
    return strNew;
}