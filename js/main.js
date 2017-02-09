var app = {};
app.mainFrame = $('main');
app.init = function() {
    //各类／Frame负责绑定自己页面上的元素事件。
    app.nav.init();
    app.nav.showProgress();

    //检查登陆之后更新nav
    app.user.checkAuth(function() {
        app.nav.update();
    });
}

app.user = {
    //保证其他对象不会调用带下划线的属性和方法
    _admin: false,
    id: "1234567890",
    name: "/Bin",
    pic: "",
    isAdmin: function() {
        return app.user._admin;
    },
    setAdmin: function(admin) {
        app.user._admin = admin;
    },
    checkAuth: function(callback) {
        $.getJSON("API/checkAuth.php", function(data) {
            if (data.result == "succeed") {
                app.user.id = data.userID;
                app.user.name = data.userName;
                app.user.pic = data.userPic;
                app.user.setAdmin(data.isAdmin);
                callback();
            } else {
                window.location.href = "API/authorize.php";
            }
        });
    },
    logout: function() {
        window.location.href = "API/revoke.php";
    }
}
app.nav = {
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
        $("#menu-logout").click(function() {
            $(this).parent().siblings(".active").removeClass("active");
            app.user.logout();
        });
    },
    update: function() {
        //app初始化时已经检查过用户信息
        if(app.user.isAdmin() == true) {
            $('.menu-admin').show();
        }
        app.nav.hideProgress();
    },
    showProgress: function() {
        app.nav._progress.css("visibility", "visible");
    },
    hideProgress: function() {
        app.nav._progress.css("visibility", "hidden");
    }
}
app.searchFrame = {
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
        alert("destroy " + (app.searchFrame._count - 1));
        app.mainFrame.empty();
    },
    alertCount: function() {
        alert("_count: " + app.searchFrame._count);
        app.searchFrame._count ++;
    }
}
app.dashboardFrame= app.searchFrame;
app.borrowFrame= app.searchFrame;
app.listMyFrame= app.searchFrame;
app.listAllFrame= app.searchFrame;
app.listHistoryFrame= app.searchFrame;
app.newFrame= app.searchFrame;

$(document).ready(function() {
    //保证该js只由main.html引用，只由main.html加载完时执行此处代码。
    app.init();
});