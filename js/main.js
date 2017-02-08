var nav = {
    _progress: $('#menu-progress'),
    init: function() {
        $(".button-collapse").sideNav();
        $("#menu-dashboard").click(function() {
            app.dashboardFrame.init();
        });
        $("#menu-borrow").click(function() {
            $(this).parent().siblings(".active").removeClass("active");
            $(this).parent().addClass("active");
            app.borrowFrame.init();
        });
        $("#menu-list-my").click(function() {
            $(this).parent().siblings(".active").removeClass("active");
            $(this).parent().addClass("active");            
            app.listMyFrame.init();
        });
        $("#menu-list-all").click(function() {
            $(this).parent().siblings(".active").removeClass("active");
            $(this).parent().addClass("active");
            app.listAllFrame.init();
        });
        $("#menu-list-history").click(function() {
            $(this).parent().siblings(".active").removeClass("active");
            $(this).parent().addClass("active");           
            app.listHistoryFrame.init();
        });
        $("#menu-new").click(function() {
            $(this).parent().siblings(".active").removeClass("active");
            $(this).parent().addClass("active");
            app.newFrame.init();
        });
    },
    update: function() {
        if(app.isAdmin() == true) {
            $('.menu-admin').show();
        }
        this.hideProgress();
    },
    showProgress: function() {
        this._progress.css("visibility", "visible");
    },
    hideProgress: function() {
        this._progress.css("visibility", "hidden");
    }
}

var searchFrame = {
    _count: 1,

    init: function() {
        app.mainFrame.load('lib/searchFrame.html', function() {
            $('#refresh').click(function() {
                app.searchFrame.destroy();
                app.searchFrame.init();
            });
            app.searchFrame.alertCount();
        });
    },
    destroy: function() {
        alert("destroy " + (this._count - 1));
        app.mainFrame.empty();
    },
    alertCount: function() {
        alert(this._count);
        this._count ++;
    }
}

var app = {
    _admin: false,
    isAdmin: function() {
        return this._admin;
    },
    mainFrame: $('main'),

    init: function() {
        //各类／Frame负责绑定自己页面上的元素事件。
        nav.init();
        nav.showProgress();

        //检查登陆之后更新nav
        setTimeout(function() {
            app._admin = true;
            nav.update();
        }, 1000);
    },

    searchFrame: searchFrame,
    dashboardFrame: searchFrame,
    borrowFrame: searchFrame,
    listMyFrame: searchFrame,
    listAllFrame: searchFrame,
    listHistoryFrame: searchFrame,
    newFrame: searchFrame
}

$(document).ready(function() {
    //保证该js只由main.html引用，只由main.html加载完时执行此处代码。
    app.init();
});