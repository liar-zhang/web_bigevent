$(function() {

    layer = layui.layer
    form = layui.form

    //初始化文章分类的列表数据
    initArtCateList();

    function initArtCateList() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function(res) {
                var htmlStr = template('tpl-table', res);
                $("tbody").html(htmlStr)
            }
        });
    }

    //添加类别按钮点击事件
    var indexAdd = null;
    $("#addCate").on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $("#dialog-add").html()
        })
    })

    //通过事件委托的方式来绑定submit事件
    $("body").on('submit', '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $('#form-add').serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    layer.msg('新增分类失败')
                }
                initArtCateList();
                layer.msg(res.message);
                layer.close(indexAdd);
            }
        })
    })

    //编辑按钮功能
    var indexEdit = null;
    $("tbody").on('click', '.btn-edit', function() {
            //弹出修改文章分类的层
            indexEdit = layer.open({
                type: 1,
                area: ['500px', '250px'],
                title: '修改文章分类',
                content: $("#dialog-edit").html()
            })
            var id = $(this).attr('data-id');
            $.ajax({
                type: "GET",
                url: "/my/article/cates/" + id,
                success: function(res) {
                    form.val('form-edit', res.data)
                }
            });
        })
        //通过代理的方式为表单绑定提交事件
    $("body").on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类信息失败！')
                }
                layer.msg(res.message)
                layer.close(indexEdit)
                initArtCateList();
            }
        });
    })

    //通过代理的方式为删除按钮绑定点击事件
    $("tbody").on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id');
        //提示用户是否要删除
        layer.confirm('确认删除', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                type: "GET",
                url: "/my/article/deletecate/" + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败！')
                    }
                    layer.msg(res.message)
                    initArtCateList();
                }
            });

            layer.close(index);
        });
    })
})