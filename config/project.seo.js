const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs-extra'));;
const path = require('path');
const colors = require('colors');
const PROJECT = require('./project.config');
const configSEO = require('../config.seo.json');
const utils = require('./project.utils');

const project_html = 'index.html';
const indexHtml = path.resolve(__dirname, PROJECT.PATH.SRC, project_html);

// 要替换描述、关键字和标题
const aRegInfo = [{
    type: 'description',
    reg: /\<meta\s+name="description"\s+content=".*"\>/,
    text: `<meta name="description" content="${configSEO.description}">`
}, {
    type: 'keywords',
    reg: /\<meta\s+name="keywords"\s+content=".*"\>/,
    text: `<meta name="keywords" content="${configSEO.keywords}">`,
}, {
    type: 'title',
    reg: /\<title\>.*\<\/title\>/,
    text: `<title>${configSEO.title}</title>`,
}];

// 获取 html 的内容
const sIndexHtml = fs.readFileSync(indexHtml, 'utf-8');
// 替换 html 的内容，得到替换后的新 html 内容
const newIndexHtml = utils.replaceHtml(aRegInfo, sIndexHtml);
// 将替换后的 html 内容 重写回去
fs.writeFileSync(indexHtml, newIndexHtml, 'utf-8');

console.log('SEO初始化完成'.green);
