var app = {};
app.config = {
    domain: 'linkin.local/Library/',
    protocal: 'http'
}

app.mainFrame = $('main');
app.init = function () {
    //各类／Frame负责绑定自己页面上的元素事件。
    $("#scan .nav").pushpin({
        top: $("#scan").offset().top,
        offset: 0
    });
    $("#confirm .nav").pushpin({
        top: $("#confirm").offset().top,
        offset: 64
    });

    $("#scan").click(function () {
        app.scrollTo($("#scan"));
    });
    $("#confirm").click(function () {
        app.scrollTo($("#confirm"));
    });
    $("#succeed").click(function () {
        app.scrollTo($("#logo"));
    });

    $("#isbn").change(function () {
        if ($("#isbn").val().match(/^\d{13}$/)) {
            app.scrollTo($("#confirm"));
        }
    });
    $("#submit").click(function () {
        $.getJSON(app.getURL("API/return.php"), {bookUID: $("#isbn").val() + $("#num").val() }, function (data) {
            if (data.result == "succeed") {
                app.scrollTo($("#succeed"));
                setTimeout(function() {
                    app.scrollTo($("#logo"));
                }, 10000);
            }
        });
    });

    //检查登陆之后更新nav
    app.user.checkAuth(function () {
    });
}
app.getURL = function (url) {
    //调用API时URL务必使用这个函数保证本地化时可用
    return app.config.protocal + '://' + app.config.domain + url;
}

app.scrollTo = function (place) {
    $("html,body").animate({scrollTop:place.offset().top},500);
}

app.user = {
    //保证其他对象不会调用带下划线的属性和方法
    _admin: false,
    id: "1234567890",
    name: "/Bin",
    pic: "",
    isAdmin: function () {
        return app.user._admin;
    },
    setAdmin: function (admin) {
        app.user._admin = admin;
    },
    checkAuth: function (callback) {
        $.getJSON(app.getURL("API/checkAuth.php"), function (data) {
            if (data.result == "succeed") {
                app.user.id = data.userID;
                app.user.name = data.userName;
                app.user.pic = data.userPic;
                app.user.setAdmin(data.isAdmin);
                callback();
            } else {
                window.location.href = app.getURL("API/authorize.php");
            }
        });
    },
    logout: function () {
        window.location.href = app.getURL("API/revoke.php");
    }
}
app.scanner = {
    val: "",
    init: function () {
    },
    onDetected: function(result) {
        $("#isbn").val(result);
        Materialize.updateTextFields();
        app.scrollTo($("#confirm"));
    }
}

$(document).ready(function () {
    //保证该js只由main.html引用，只由main.html加载完时执行此处代码。
    app.init();
});