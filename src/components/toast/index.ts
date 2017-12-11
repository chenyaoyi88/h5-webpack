import './toast.scss';
/**
 * toast 显示
 * @param {*String} text 要显示的文本内容
 */
const toast = function (text: string) {

    if (document.getElementById('toast')) {
        return false;
    }

    const doc = document.body;
    const toastText = text;

    doc.insertAdjacentHTML(
        'beforeend',
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
};

export { toast };