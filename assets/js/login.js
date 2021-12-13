$(function() {

    $("#link-login").on('click', function() {
        $(".login-box").show();
        $(".reg-box").hide()
    });

    $("#link-reg").on('click', function() {
        $(".login-box").hide();
        $(".reg-box").show()
    });

    // 表单校验
    // 1.从layui中获取form对象
    var form = layui.form
    var layer = layui.layer

    // 通过form.verify()函数自定义校验规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repwds: function(value) {
            //通过形参拿到的是确认密码框中的数值
            var pwds = $(".reg-box [name=password]").val();
            if (pwds !== value) {
                return '两次输入密码不一致'
            }
        }
    });

    //监听注册表单的提交事件
    $("#form_reg").on('submit', function(e) {
        e.preventDefault()
        console.log(1);
        //发起Ajax的POST请求
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()

        }
        $.post("/api/reguser", data, function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('注册成功，请登录');
                //模拟点击登录的行为
                $('#link-login').click();
            }

        );
    })

    //监听登录表单的提交事件
    $("#form_login").submit(function(e) {
        e.preventDefault();
        $.ajax({
            type: "post",
            url: "/api/login",
            //快速获取表单中的数据 jquery中的API
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败')
                }
                layer.msg(res.message);
                //将登录成功得到的token字符串保存到loaclStorage中
                localStorage.setItem('token', res.token)
                location.href = '/index.html'
            }
        });
    });
})