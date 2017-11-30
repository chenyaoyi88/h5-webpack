(function (win) {
    const docEl = win.document.documentElement;
    // 设计图宽度：默认按 750 计算
    const PSD_STD = 750;
    // 换算比例
    const CALC_SCALE = 100;
    // 计算 rem
    function refreshRem() {
        docEl.style.fontSize = docEl.clientWidth / (PSD_STD / 100) + 'px';
    }

    win.addEventListener('resize', function () {
        refreshRem();
    }, false);

    win.addEventListener('pageshow', function (e) {
        if (e.persisted) {
            refreshRem();
        }
    }, false);

    refreshRem();

})(window);