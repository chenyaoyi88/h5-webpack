import '../sass/index.scss';
import { ajax, Tool, api, weixin } from './util';
import { toast, loading, modal } from '../components';
import { modalConfig } from './config';

Tool.domReady(() => {
  // 初始化微信 js-sdk 配置，以及分享到朋友圈/好友功能
  // weixin.init();

  let str = ``;

  for (let i = 0; i < 5; i++) {
    str += `
    <tr>
      <td>123</td>
      <td>456</td>
    </tr>
    `;
  };

  modal.show({
    modalClass: `act-other`,
    content: `
        <div class="modal-table-wrap">
          <table>
            <thead>
              <tr>
                <th>爱爱爱</th>
                <th>呀呀呀</th>
              </tr>
            </thead>
            <tbody>
              ${str}
            </tbody>
          </table>
        </div>
        `,
    confirmText: '我知道了'
  });

  const oBtnSubmit = document.getElementById('submit-btn');
  const oPhone = document.getElementById('phone') as HTMLInputElement;

  /**
   * 点击领取请求接口拿结果
   */
  oBtnSubmit.addEventListener(
    'click',
    function () {

      if (!/\d{11}/.test(oPhone.value)) {
        toast('您输入的手机号码格式有误');
        return;
      }

      loading.show();
      setTimeout(function () {
        loading.hide();

        modal.show(modalConfig({
          code: 'success',
          isShowAnimate: true,
          openCallback: function () {
            console.log('open');
          },
          confirmCallback: function () {
            console.log('success');
          }
        }));

      }, 300);
    },
    false
  );
});
