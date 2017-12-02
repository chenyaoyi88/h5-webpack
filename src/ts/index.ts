console.log('当前环境：' + process.env.NODE_ENV);
// 非生产环境，将 index.html 导进来，从而达到修改 html 文件的时候触发 reload
if (process.env.NODE_ENV !== 'production') {
    require('../index.html');
} else {
    console.log = function(){};
}
// 处理外部第三方库
import { $, _ } from '../vendor/vendor';
// 处理 css 包括背景图片
import '../css/style.css';
// 处理 scss 包括背景图片
import '../sass/index.scss';
// 处理 图片
import * as Icon from '../images/ts-img.jpg';
// 处理 js 文件
import printMe from '../js/print.js';


function component() {

    console.log($('#box'));

    var element = document.createElement('div');
    var btn = document.createElement('button');

    // 使用第三方方法库
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.classList.add('hello');

    // 使用 typescript 方式定义的方法 sayName
    btn.innerHTML = sayName('fuck');
    btn.onclick = printMe;
    element.appendChild(btn);

    // 使用导入的图片
    var myIcon = new Image();
    myIcon.src = Icon;

    element.appendChild(myIcon);

    return element;
}

document.body.appendChild(component());

function sayName(name: string) {
    return `your name is ${name}`;
}