$(document).ready(function () {
    loadData();
    loadDataD();
    initListData();
});

//加载数据-from-JSON
function loadData() {
    //数据
    var demoArray = [
        {
            NAME: "永恒之心",
            EMAIL: "Eterl@126.com",
            DETAIL: "黯灭军团-灰烬之刃",
            ID:"c81e728d9d4c2f636f067f89cc14862c",
        },
        {
            NAME: "命运之矛",
            EMAIL: "Tuic@163.com",
            DETAIL: "翡翠梦境-影",
            ID: "eccbc87e4b5ce2fe28308fd9f2a7baf3",
        },
        {
            NAME: "星空",
            EMAIL: "Ho@gmail.com",
            DETAIL: "巨龙之魂-光华",
            ID: "cfcd208495d565ef66e7dff9f98764da",
        }
    ];
    
    $.karmaLBind(demoArray, "./template/item.html", $("#demo_list"));
}
//加载数据-from-DataBase
function loadDataD() {
    //此方法就是getServerData
    $.kSerData({ actionType: "query"}, "resource/karmawidgets/demo/action/demo.xml", true, function (result) {
        if (result.karma_plugin_demo) {
            $.karmaLBind(result.karma_plugin_demo, "./template/data_item.html", $("#demo_db_list"));
        }
    });
}
//列表对象
var demoListObj = {
    page: 'page_link',
    pageRows: 10,
    limits: [20, 30, 40, 50],
    color: "#ce0e09",
    layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],//选择行数下拉列表的开启需要把分页容器放到[非layui-form修饰的元素]下
    list: $("#demo_page_list"),//列表容器元素
    path: "resource/karmawidgets/demo/action/demo.xml",//请求xml地址
    actionTypeFirst: "query_all_karma_plugin_demo",//首次请求地址
    actionType: "query_karma_plugin_demo",//分页请求地址
    Param: {
    },//查询条件参数
    getRequestRecordCount: function (result) {
        return result.karma_plugin_demo_num.NUM;
    },//获取总记录数
    firstRequestCallback: function (result) {


    },//首次回调
    requestCallback: function (result) {
        if (result.karma_plugin_demo) {
            $("#demo_page_list").html('');
            $.karmaLBind(result.karma_plugin_demo, "./template/pg_item.html", $("#demo_page_list"));
        }
    }//回调
}
//初始列表对象并查询
function initListData() {
    $.karmaFnpMap("x0", demoListObj);//初始化分页对象
    $.karmaFnData(true, "x0");//查询
}
//打开详情
function openDetail(id) {
    alert(id);
}