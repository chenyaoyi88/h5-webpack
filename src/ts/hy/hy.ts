/**
 * 判断是否微信
 * 
 * @returns {boolean} true 是微信，false 不是
 */
function isWeixin(): boolean {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) && ua.match(/MicroMessenger/i).length > 0) {
        return true;
    } else {
        return false;
    }
}

/**
 * 下载对应的 app
 * 
 * @param {string} [type='other'] 
 */
function appDownload(type: string = 'other'): void {
    var ua = navigator.userAgent;
    if (ua.match(/iPad/i) || ua.match(/iPhone/i) || ua.match(/iPod/i)) {
        // 如果是 ios 设备
        if (type === 'buyer') {
            // ios 买家
            window.location.href = '//a.app.qq.com/o/simple.jsp?pkgname=com.highsunbuy';
        } else {
            // ios 司机
            window.location.href = '//a.app.qq.com/o/simple.jsp?pkgname=com.highsun.driver';
        }
    } else if (ua.match(/Android/i) && isWeixin()) {
        // 如果是 Android 设备
        if (type === 'driver') {
            // Android 司机
            window.location.href = '//a.app.qq.com/o/simple.jsp?pkgname=com.highsun.driver';
        } else {
            // Android 买家
            window.location.href = '//a.app.qq.com/o/simple.jsp?pkgname=com.highsunbuy';
        }
    } else {
        window.location.href = '//www.guanghuobao.com/android/ghb-seller.apk';
    }
}

export { appDownload };