//每次调用$.get()或$.post()或$.ajax()的时候
//会先调用ajaxPrefilter这个函数
//再这个函数中，可以拿到我们给Ajax提供的配置对象

$.ajaxPrefilter(function(options) {

    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
    //统一为有权限的请求接口设置headers请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = { Authorization: localStorage.getItem('token') || '' }
    }
    //全局统一挂载complete回调函数
    options.complete = function(res) {
        //在complete回调函数中通过res.responseJSON来获取服务器响应的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //强制清空token
            localStorage.removeItem('token');
            //强制跳转到登录页面身份认证失败！
            location.href = '/login.html'
        }
    }
})