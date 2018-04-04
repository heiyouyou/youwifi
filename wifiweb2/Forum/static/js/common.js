/**
 * author: wzy
 * time: 2018/03/14
 * description: 公共的业务方法和全局变量
 */
 
export const global = {
    wifi:{}
}

// 百度服务端key
export const SERVER_BAIDU_KEY = '5K3kPVyuMqBvZcinxZuLNWvwxiiN0Eyk'
// 百度浏览器端key
export const CLIENT_BAIDU_KEY = 'FYjp179jiNXWaRytow8a4N0oe1jEfXiK'
// 云存储表id
export const geotableId = 184953

/**
 * 基于bootstrap-notify封装的一个公共信息通告函数
 * 
 * @param {any} [{message,type,enter,exit}={}] 
 */
export function b_notify({message='Error!',type='success',enter='animated fadeInDown',exit='animated fadeOutUp',mouse_over='pause'}={}){
    $.notify({
        // options
        message:message 
    },{
        // settings
        type: type,
        animate: {
            enter: enter,
            exit: exit
        },
        mouse_over:mouse_over
    });
}