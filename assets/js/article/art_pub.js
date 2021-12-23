$(function() {
    layer = layui.layer
    form = layui.form

    initCate();
    initEditor();
    //定义加载文章分类的方法
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！')
                }
                //调用模板引擎渲染下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        });
    }

    // 头像裁剪
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //为选择封面的按钮绑定点击事件
    $('#btnChooseImage').on('click', function() {
        $('#coverFill').click()
    })

    //监听coverFill的change事件，获取用户的选择的文件列表
    $('#coverFill').on('change', function(e) {
        //获取到的文件列表数组
        var files = e.target.files
            //判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        //根据文件创建对应的文件url地址
        var newImgURL = URL.createObjectURL(files[0]);
        //为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    //定义发布文章的状态
    var art_state = '已发布';
    //为存为草稿按钮绑定点击事件
    $("#btnSave2").on('click', function() {
        art_state = '草稿'
    });
    //为表单绑定submit提交事件
    $("#form-pub").on('submit', function(e) {
        e.preventDefault();
        //基于表单快速创建一个formDate对象
        var fd = new FormData($(this)[0]);
        //将文章的发布状态存到fd中
        fd.append('state', art_state);
        //将封面裁剪完成的图片输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                //将得到的文件对象，储存到fd中
                fd.append('cover_img', blob);
                //发起ajax请求
                publishArticle(fd)
            })
    });
    //定义发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            type: "POST",
            url: "/my/article/add",
            data: fd,
            //如果向服务器提交的是FormData格式的数据必须提交一下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg(res.message);
                //发布文章成功后跳转到列表页面
                location.href = '/article/art_list.html'
            }
        });
    }
})