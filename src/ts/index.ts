import '../sass/index.scss';
import { ajax, Tool, api, weixin } from './util';
import { toast, loading, modal } from '../components';
import { modalConfig } from './config';

Tool.domReady(() => {
  // 初始化微信 js-sdk 配置，以及分享到朋友圈/好友功能
  // weixin.init();

  let str = ``;

  for (let i = 0; i < 25; i++) {
    str += `
    <tr>
      <td>123</td>
      <td>456</td>
    </tr>
    `;
  };

  // modal.show({
  //   modalClass: `act-other`,
  //   content: `
  //       <div class="modal-table-wrap">
  //         <table>
  //           <thead>
  //             <tr>
  //               <th>爱爱爱</th>
  //               <th>呀呀呀</th>
  //             </tr>
  //           </thead>
  //         </table>
  //         <div class="table-list-wrap">
  //           <table>
  //             <tbody>
  //               ${str}
  //             </tbody>
  //           </table>
  //         </div>
  //       </div>
  //       `,
  //   confirmText: '我知道了'
  // });

  const oPhone = document.getElementById('phone') as HTMLInputElement;

  document.addEventListener('click', function (ev) {
    const oEvent = ev || event;
    const oTarget = oEvent.srcElement || oEvent.target;

    switch (oTarget['id']) {
      case 'show-modal-text':
        modal.show(modalConfig({
          code: 'success',
          content: '测试弹窗显示文字'
        }));
        break;
      case 'show-modal-img':
        modal.show(modalConfig({
          code: 'success'
        }));
        break;
      case 'show-modal-cb':
        modal.show(modalConfig({
          code: 'success',
          beforeOpenCallback: function () {
            alert('准备打开弹窗');
          },
          openCallback: function () {
            alert('弹窗打开结束');
          },
          confirmCallback: function () {
            alert('弹窗关闭结束');
          }
        }));
        break;
      case 'show-toast':
        toast('这是测试 toast 提示');
        break;
    }

  }, false);

});
