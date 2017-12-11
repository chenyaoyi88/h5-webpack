
import * as IMG_get from '../../images/get.png';
import * as IMG_subscribe from '../../images/subscribe.png';
import * as IMG_unmatch from '../../images/unmatch.png';
import * as IMG_unapply from '../../images/unapply.png';
import * as IMG_nofound from '../../images/nofound.png';
import * as IMG_success from '../../images/success.png';
import * as IMG_audit from '../../images/audit.png';
import * as IMG_over from '../../images/over.png';
/**
 * 弹窗的公共配置
 * @param type 弹窗的类型
 */
const modalConfig = function (code: string) {
    let imgSrc = '';
    let text1 = '';
    let text2 = '';
    let type = '';

    /**
     * 弹窗类型：
     * success      000 成功
     * error        500 失败系统内部异常
     * nofound      001 未查询到手机号
     * unapply      002 审核状态<已提交
     * unmatch      003 GPS坐标不符或司机状态=审核不通过
     * unmatch      008 老司机不能参与
     * subscribe    004 没有关注公众号
     * get          005 已领取
     * over         006 成功抽奖人数>100
     * audit        007 审核状态=已申请
     */

    switch (code) {
        case '000':
            type = 'success';
            imgSrc = IMG_success;
            text1 = '50元奖金即将通过广货宝公众号发送给您，请勿解除关注！';
            text2 = '';
            break;
        case '001':
            type = 'nofound';
            imgSrc = IMG_nofound;
            text1 = '您还没注册广货宝司机，请注册后再来领奖吧！';
            text2 = '';
            break;
        case '002':
            type = 'unapply';
            imgSrc = IMG_unapply;
            text1 = '您还没提交申请资料，提交完';
            text2 = '就能领奖啦！';
            break;
        case '008':
        case '003':
            type = 'unmatch';
            imgSrc = IMG_unmatch;
            text1 = '非常抱歉您的资料不符合';
            text2 = '本次活动要求！';
            break;
        case '004':
            type = 'subscribe';
            imgSrc = IMG_subscribe;
            text1 = '请先关注“广货宝”公众号';
            text2 = '奖励会通过广货宝公众号发送给您！';
            break;
        case '005':
            type = 'get';
            imgSrc = IMG_get;
            text1 = '您已经领过本次奖励，不能再领啦';
            text2 = '推荐您的司机朋友来注册领奖吧！';
            break;
        case '006':
            type = 'over';
            imgSrc = IMG_over;
            text1 = '活动已经结束啦，谢谢您的参与！';
            text2 = '';
            break;
        case '007':
            type = 'audit';
            imgSrc = IMG_audit;
            text1 = '您的资料正在审核中';
            text2 = '请等待审核完毕';
            break;
        default:
            type = 'error';
            imgSrc = IMG_unmatch;
            text1 = '网络繁忙，请稍后再试！';
            text2 = '';
    }
    return {
        modalClass: `act-signup ${type}`,
        content: `
        <div class="modal-img-wrap">
            <img class="img" src="${imgSrc}" alt="">
        </div>
        <div class="modal-text">
            <p class="text">${text1}</p>
            <p class="text">${text2}</p>
        </div>
        `,
        confirmText: '我知道了'
    }
}

export { modalConfig };