$(function() {

    var layer = layui.layer
    var form = layui.form

    //自定义校验规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function(value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新密码不能和原密码相同'
            }
        },
        rePwd: function(value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致'
            }
        }
    })

    //重置密码请求
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        var data = $(this).serialize()
        $.ajax({
            type: "post",
            url: "/my/updatepwd",
            data: data,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('密码修改成功');
                //重置表单
                $('.layui-form')[0].reset()
            }
        });
    })
})