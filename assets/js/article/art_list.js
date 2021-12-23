$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
        //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
            const dt = new Date(date)
            var y = dt.getFullYear();
            var m = padZero(dt.getMonth() + 1);
            var d = padZero(dt.getDate());

            var hh = padZero(dt.getHours());
            var mm = padZero(dt.getMinutes());
            var ss = padZero(dt.getSeconds());

            return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss
        }
        //定义补0的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    //定义一个查询参数对象，将来请求数据的时候
    //需要将请求参数对象发送到服务器
    var q = {
        pagenum: 1, //页码值，默认请求第一页的数据
        pagesize: 2, //每页显示几条数据，默认每页显示2条
        cate_id: '', //文章分类的id
        state: '' //文章的发布状态
    }
    initTable();
    initCate();
    //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                //使用模板引擎渲染数据
                console.log(res);
                var htmlStr = template('tpl-table', res);
                $("tbody").html(htmlStr);
                //调用渲染分页的方法
                renderPage(res.total);
            }
        });
    }

    //初始化文章的分类的方法
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！')
                }
                //调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $("[name=cate_id]").html(htmlStr)
                    //通过layui重新渲染表单结构
                form.render()
            }
        });
    }

    //为筛选表单绑定submit事件
    $("#form-search").on('submit', function(e) {
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        //为查询参数对象q中对应属性赋值
        q.cate_id = cate_id
        q.state = state
            //根据最新的筛选条件重新渲染表格数据
        initTable()
    })

    //定义渲染分页的方法
    function renderPage(total) {
        //调用laypage.render()来渲染分页的结构
        laypage.render({
            elem: 'pageBox', //分页容器id
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //jump切换分页回调
            //触发jump的条件 1.点击页面 2.只要调用了laypage.render()方法
            jump: function(obj, first) {
                //obj中包含了当前分页所有的参数
                //可以通过first来判断是哪种方式触发的回调
                q.pagenum = obj.curr;
                //把最新的条目数赋值到q对象中
                q.pagesize = obj.limit
                    //根据最新的q获取对应的数据列表，渲染表格
                if (!first) {
                    initTable()
                }
            }
        });
    }

    //为删除按钮绑定点击事件
    $("tbody").on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id');
        //获取当前页面中的删除按钮个数
        var len = $('.btn-delete').length;
        //弹出询问框
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                type: "GET",
                url: "/my/article/delete/" + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败！')
                    }
                    layer.msg(res.message);
                    //如果len等于1 那么就说明完成删除操作之后当前页面就没有数据了
                    if (len == 1) {
                        //表格的页码数最小必须是1
                        q.pagenum = q.pagenum === 1 ? q.pagenum : q.pagenum - 1
                    }
                    initTable()
                }
            });

            layer.close(index);
        });
    })
})