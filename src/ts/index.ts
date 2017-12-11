
import '../sass/index.scss';
import { ajax, Tool, api, weixin } from './util';
import { toast, loading, modal } from '../components';
import { modalConfig } from './config';

Tool.domReady(() => {

    // 初始化微信 js-sdk 配置，以及分享到朋友圈/好友功能
    weixin.init();

    const oBtnSubmit = document.getElementById('submit-btn');
    const oBtnDownload = document.getElementById('download-btn');
    const oPhone = (document.getElementById('phone') as HTMLInputElement);

    /**
     * 点击领取请求接口拿结果
     */
    oBtnSubmit.addEventListener('click', function () {

        if (!(/\d{11}/.test(oPhone.value))) {
            toast('您输入的手机号码格式有误');
            return;
        }

        loading.show();

        ajax({
            type: 'POST',
            url: api.receiveRedpack,
            data: JSON.stringify({
                phone: oPhone.value,
                openId: Tool.getQueryString('openId')
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            success: function (data: any) {
                loading.hide();
                modal.show(modalConfig(data.code));
                console.log(data);
            },
            error: function (err: any) {
                loading.hide();
                console.log(err);
                modal.show(modalConfig('500'));
            }
        });

    }, false);

    /**
     * 点击下载司机端 app 
     */
    oBtnDownload.addEventListener('click', function () {
        Tool.appDownload('dirver');
    }, false);

});