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
            $('.button-collapse').sideNav('hide');
        });
        $("#menu-borrow").click(function() {
            $(this).parent().siblings(".active").removeClass("active");
            $(this).parent().addClass("active");
            $('.button-collapse').sideNav('hide');
            app.borrowFrame.init();
        });
        $("#menu-list-my").click(function() {
            $(this).parent().siblings(".active").removeClass("active");
            $(this).parent().addClass("active");
            $('.button-collapse').sideNav('hide');            
            app.listMyFrame.init();
        });
        $("#menu-list-all").click(function() {
            $(this).parent().siblings(".active").removeClass("active");
            $(this).parent().addClass("active");
            $('.button-collapse').sideNav('hide');
            app.listAllFrame.init();
        });
        $("#menu-list-history").click(function() {
            $(this).parent().siblings(".active").removeClass("active");
            $(this).parent().addClass("active");
            $('.button-collapse').sideNav('hide');           
            app.listHistoryFrame.init();
        });
        $("#menu-new").click(function() {
            $(this).parent().siblings(".active").removeClass("active");
            $(this).parent().addClass("active");
            $('.button-collapse').sideNav('hide');
            app.newFrame.init();
        });
        $("#menu-logout").click(function() {
            $(this).parent().siblings(".active").removeClass("active");
            $('.button-collapse').sideNav('hide');
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
        app.mainFrame.load('lib/searchFrame.html', function () {
            $('#refresh').click(function () {
                app.searchFrame.destroy();
                app.searchFrame.init();
            });
            app.searchFrame.alertCount();
            $.getJSON("API/test.php", {
                isbn: {isbn: 12345} ,
                shuzu: [{color: 1},{color: 2}]
            }, function (data) {
                alert(data);
            });
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
app.borrowFrame= {
    bookCard: [],
    init: function() {
        app.mainFrame.load("lib/borrowFrame.html", function() {
            $('.modal').modal();
            $("#search-button").click(function() {
                $("#search-button").hide();
                $("#search-preloder").show();
                $.getJSON("API/isbn.php", {isbn: $("#isbn").val()}, function(data) {
                    if (data.result == "succeed") {
                        $("#isbn-card").hide();
                        for (i in data.books) {
                            app.borrowFrame.bookCard[i] = new app.borrowFrame.BookCard(data.books[i]);
                            $("#book-container").append(app.borrowFrame.bookCard[i].card);
                        }
                    }
                });
            });
        })
    }
}
//在app.borrowFrame名称空间下定义类BookCard
app.borrowFrame.BookCard = function(property) {
    var _this = this;     //在一些jquery绑定的函数中this指像jquery的dom对象
    this.isbn = property.isbn13;
    this.amount = property.amount;
    this.card = $("#default-book-card").clone();
    this.card.find(".book-image").attr("src", property.images.large);
    this.card.find(".book-title").html(property.title);
    this.card.find(".book-author").html(property.author.join('、'));
    this.card.find(".book-tags").html('<div class="chip">' + property.tags.join('</div><div class="chip">') + '</div>');
    this.card.find(".book-pubdate").html(property.pubdate);
    this.card.find(".book-summary").html(property.summary);
    this.card.find(".book-location").html(property.location);
    this.card.find(".book-borrow").attr("isbn", property.isbn13);
    this.card.find(".book-borrow").click(function() {
        _this.borrow();
    });
    this.card.find(".book-card-borrow-preloder").hide();
    this.card.find(".book-card-borrow-done").hide();
    this.card.show();
}
app.borrowFrame.BookCard.prototype.borrow = function() {
    var _this = this;
    if (_this.amount > 1) {
        $('#book-borrow-dialog-confirm-done').hide();
        $('#book-borrow-dialog-confirm-preloder').hide();
        $('#book-borrow-dialog').modal('open');
        $('#book-borrow-dialog-confirm').click(function() {
            if ($('#book-borrow-dialog-num').hasClass("valid")) {
                $('#book-borrow-dialog-confirm').hide();
                $('#book-borrow-dialog-cancel').hide();
                $('#book-borrow-dialog-confirm-preloder').show();
                $.getJSON("API/borrow.php", {bookUID: _this.isbn + $('#book-borrow-dialog-num').val()}, function(data) {
                    if (data.result == "succeed") {
                        $('#book-borrow-dialog-confirm-preloder').hide();
                        $('#book-borrow-dialog-confirm-done').show();
                    } else {
                        $('#book-borrow-dialog-confirm-preloder').hide();
                        $('#book-borrow-dialog-cancel').show();
                        Materialize.toast(data.result, 3000);
                    }
                });
            }
        });
    } else {
        _this.card.find(".book-borrow").hide();
        _this.card.find(".book-card-borrow-preloder").show();
        $.getJSON("API/borrow.php", {bookUID: _this.isbn + "0"}, function(data) {
            if (data.result == "succeed") {
                _this.card.find(".book-card-borrow-preloder").hide();
                _this.card.find(".book-card-borrow-done").show();
            } else {
                _this.card.find(".book-card-borrow-preloder").hide();
                _this.card.find(".book-borrow").show();
                Materialize.toast(data.result, 2000);
            }
        });
    }
}
app.borrowFrame.BookCard.prototype.destroy = function() {
    this.card.remove();
}

app.listMyFrame= app.searchFrame;
app.listAllFrame= app.searchFrame;
app.listHistoryFrame= app.searchFrame;
app.newFrame= app.searchFrame;

$(document).ready(function() {
    //保证该js只由main.html引用，只由main.html加载完时执行此处代码。
    app.init();
});