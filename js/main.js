var app = {
    _isAdmin: false,
    _mainFrame: $('main'),

    init: function() {
        //各Frame／类对应一个html和一个js，各类／Frame负责绑定自己页面上的元素事件。
        $(".button-collapse").sideNav();
        this.getSearchFrame();
    },

    //一下几个方法用于引入／删除一个Frame／类，表现为替换_mainFrame的元素。这几个方法可能会被其他类／对象调用。
    //务必注意load方法是非阻塞的
    getSearchFrame: function() {
        this._mainFrame.load("lib/searchFrame.html", function() {
            searchFrame.init();
        });
    },
    removeSearchFrame: function() {
        searchFrame.destroy();
        this._mainFrame.empty();
    }
}

$(document).ready(function() {
    //保证该js只由main.html引用，只由main.html加载完时执行此处代码。
    app.init();
});