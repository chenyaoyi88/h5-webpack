import './loading.scss';

const loading = {
    show: function (text: string = '加载中') {
        if (document.getElementById('loading')) {
            return false;
        }
        document.body.insertAdjacentHTML(
            'beforeend',
            `
                <div class="loading" id="loading">
                    <div class="loading-timer"></div>
                    <div class="loading-text">${text}</div>
                </div>
                `
        );
    },
    hide: function () {
        const oLoading = document.getElementById('loading');
        if (!oLoading) {
            return false;
        }
        document.body.removeChild(oLoading);
    }
}

export { loading };