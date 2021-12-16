$(function() {
        getUserInfo();


        //退出登录点击事件
        layer = layui.layer
        $('#btnlogout').on('click', function() {
            //提示用户是否退出
            layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function(index) {
                //情况本地存储中的token
                localStorage.removeItem('token');
                //重新跳转到登录页面
                location.href = '/login.html';
                //关闭询问框
                layer.close(index);
            });
        })
    })
    //获取用户基本信息
function getUserInfo() {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        headers: { Authorization: localStorage.getItem('token') || '' },
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败')
            }
            renderAvatar(res.data)
        },
        //请求不论成功还是失败都会调用compelte回调函数
        //complete: function(res) {

        /* //在complete回调函数中通过res.responseJSON来获取服务器响应的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //强制清空token
            localStorage.removeItem('token');
            //强制跳转到登录页面身份认证失败！
            location.href = '/login.html'
        } */
        // }
    });

}

//渲染用户的头像
function renderAvatar(user) {
    //获取用户的名称
    var name = user.nickname || user.username;
    //获取欢迎语
    $('#welcome-msg').html('欢迎&nbsp;&nbsp;' + name);
    //按需渲染用户的头像
    if (user.user_pic !== null) {
        //渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        //渲染文字头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}