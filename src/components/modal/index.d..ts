interface ShowModal {
    // 要现实的文本
    content: string;
    // 是否展示动画
    isShowAnimate?: boolean;
    // 是否展示动画
    modalAnimate?: string;
    // modal 另外添加的样式名
    modalClass?: string;
    // modalWrap 另外添加的样式名
    modalWrapClass?: string;
    // textWrap 另外添加的样式名
    textWrapClass?: string;
    // contentWrap 另外添加的样式名
    contentWrapClass?: string;
    // 确定按钮文字
    confirmText?: string;
    // 确定按钮自定义
    confirmHtml?: string;
    // 确定按钮回调
    confirmCallback?: Function;
    // 关闭按钮回调
    closeCallback?: Function;
}