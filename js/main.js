var app = {};
app.config = {
    domain: 'linkin.local/Library/',
    protocal: 'http'
}

app.mainFrame = $('main');
app.init = function () {
    //各类／Frame负责绑定自己页面上的元素事件。
    app.nav.init();
    app.nav.showProgress();

    //检查登陆之后更新nav
    app.user.checkAuth(function () {
        app.nav.update();
        app.nav.jumpArgs();
    });
}
app.getURL = function (url) {
    //调用API时URL务必使用这个函数保证本地化时可用
    return app.config.protocal + '://' + app.config.domain + url;
}
app.getArgs = function () {
    var args = {};
    var match = null;
    var search = decodeURIComponent(location.search.substring(1));
    var reg = /(?:([^&]+)=([^&]+))/g;
    while ((match = reg.exec(search)) !== null) {
        args[match[1]] = match[2];
    }
    return args;
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
app.nav = {
    _progress: $('#menu-progress'),
    init: function () {
        $(".button-collapse").sideNav();
        $("#menu-dashboard").click(app.nav.openDashboard);
        $("#menu-borrow").click(app.nav.openBorrow);
        $("#menu-list-my").click(app.nav.openListMy);
        $("#menu-list-all").click(app.nav.openListAll);
        $("#menu-list-history").click(app.nav.openListHistory);
        $("#menu-new").click(app.nav.openNew);
        $("#menu-logout").click(app.nav.openLogout);
    },
    update: function () {
        //app初始化时已经检查过用户信息
        if (app.user.isAdmin() == true) {
            $('.menu-admin').show();
        }
        app.nav.hideProgress();
    },
    showProgress: function () {
        app.nav._progress.css("visibility", "visible");
    },
    hideProgress: function () {
        app.nav._progress.css("visibility", "hidden");
    },
    openDashboard: function () {
        $('.button-collapse').sideNav('hide');
        $("#frame-title").html("北邮易班图书馆");
        app.dashboardFrame.init();
    },
    openBorrow: function () {
        $(this).parent().siblings(".active").removeClass("active");
        $(this).parent().addClass("active");
        $('.button-collapse').sideNav('hide');
        $("#frame-title").html("借书");
        app.borrowFrame.init();
    },
    openListMy: function () {
        $(this).parent().siblings(".active").removeClass("active");
        $(this).parent().addClass("active");
        $('.button-collapse').sideNav('hide');
        $("#frame-title").html("已借书籍");
        app.listMyFrame.init();
    },
    openListAll: function () {
        $(this).parent().siblings(".active").removeClass("active");
        $(this).parent().addClass("active");
        $('.button-collapse').sideNav('hide');
        $("#frame-title").html("全部借阅信息");
        app.listAllFrame.init();
    },
    openListHistory: function () {
        $(this).parent().siblings(".active").removeClass("active");
        $(this).parent().addClass("active");
        $('.button-collapse').sideNav('hide');
        $("#frame-title").html("历史记录");
        app.listHistoryFrame.init();
    },
    openNew: function () {
        $(this).parent().siblings(".active").removeClass("active");
        $(this).parent().addClass("active");
        $('.button-collapse').sideNav('hide');
        $("#frame-title").html("录入");
        app.newFrame.init();
    },
    openLogout: function () {
        $(this).parent().siblings(".active").removeClass("active");
        $('.button-collapse').sideNav('hide');
        app.user.logout();
    },
    jumpArgs: function () {
        var query = app.getArgs();
        switch (query.page) {
            case "listHistory":
                app.nav.openListHistory();
                app.listHistoryFrame.open(query.isbn);
                break;
            default:
                app.nav.openBorrow();
                break;
        }
    }
}
app.searchFrame = {
    _count: 1,

    init: function () {
        app.mainFrame.load('lib/searchFrame.html', function () {
            $('#refresh').click(function () {
                app.searchFrame.destroy();
                app.searchFrame.init();
            });
            app.searchFrame.alertCount();
            $.getJSON("API/test.php", {
                isbn: { isbn: 12345 },
                shuzu: [{ color: 1 }, { color: 2 }]
            }, function (data) {
                alert(data);
            });
        });
    },
    destroy: function () {
        alert("destroy " + (app.searchFrame._count - 1));
        app.mainFrame.empty();
    },
    alertCount: function () {
        alert("_count: " + app.searchFrame._count);
        app.searchFrame._count++;
    }
}
app.dashboardFrame = app.searchFrame;
app.borrowFrame = {
    bookCard: [],
    init: function () {
        app.mainFrame.load("lib/borrowFrame.html", function () {
            $('.modal').modal();
            $("#search-button").click(function () {
                $("#search-button").hide();
                $("#search-preloder").show();
                $.getJSON(app.getURL("API/isbn.php"), { isbn: $("#isbn").val() }, function (data) {
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
app.borrowFrame.BookCard = function (property) {
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
    this.card.find(".book-borrow").click(function () {
        _this.borrow();
    });
    this.card.find(".book-card-borrow-preloder").hide();
    this.card.find(".book-card-borrow-done").hide();
    this.card.show();
}
app.borrowFrame.BookCard.prototype.borrow = function () {
    var _this = this;
    if (_this.amount > 1) {
        $('#book-borrow-dialog-confirm-done').hide();
        $('#book-borrow-dialog-confirm-preloder').hide();
        $('#book-borrow-dialog').modal('open');
        $('#book-borrow-dialog-confirm').click(function () {
            if ($('#book-borrow-dialog-num').hasClass("valid")) {
                $('#book-borrow-dialog-confirm').hide();
                $('#book-borrow-dialog-cancel').hide();
                $('#book-borrow-dialog-confirm-preloder').show();
                $.getJSON(app.getURL("API/borrow.php"), { bookUID: _this.isbn + $('#book-borrow-dialog-num').val() }, function (data) {
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
        $.getJSON(app.getURL("API/borrow.php"), { bookUID: _this.isbn + "0" }, function (data) {
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
app.borrowFrame.BookCard.prototype.destroy = function () {
    this.card.remove();
}

app.listMyFrame = {
    bookCard: [],
    init: function () {
        app.mainFrame.load("lib/listMyFrame.html", function () {
            $.getJSON(app.getURL("API/listMy.php"), function (data) {
                if (data.result == "succeed") {
                    for (i in data.books) {
                        app.listMyFrame.bookCard[i] = new app.listMyFrame.BookCard(data.books[i]);
                        $("#book-container").append(app.listMyFrame.bookCard[i].card);
                    }
                }
            });
        });
    }
};
app.listMyFrame.BookCard = function (property) {
    this.card = $("#default-book-card").clone();
    this.card.find(".book-image").attr("src", property.images.large);
    this.card.find(".book-title").html(property.title);
    this.card.find(".book-author").html(property.author.join('、'));
    this.card.find(".book-tags").html('<div class="chip">' + property.tags.join('</div><div class="chip">') + '</div>');
    this.card.find(".book-pubdate").html(property.pubdate);
    this.card.find(".book-summary").html(property.summary);
    this.card.find(".book-location").html(property.location);
    this.card.find(".book-rest").html(property.rest);
    this.card.show();
}

app.listAllFrame = {
    init: function () {
        app.mainFrame.load("lib/listAllFrame.html", function () {
            $.getJSON(app.getURL("API/listAll.php"), function (data) {
                if (data.result == "succeed") {
                    if (data.data.length == 0) {
                        return;
                    }
                    $("#default").hide();
                    var tempRow;
                    for (i in data.data) {
                        tempRow = $("#sample-row").clone()
                        tempRow.removeAttr("id");
                        tempRow.find(".book").html(data.data[i].title);
                        tempRow.find(".book").attr("href", "?page=listHistory&isbn=" + data.data[i].isbn);
                        tempRow.find(".borrower").html(data.data[i].borrower);
                        tempRow.find(".borrow-date").html(data.data[i].borrowDate);
                        tempRow.find(".due-date").html(data.data[i].dueDate);
                        tempRow.show();
                        $("tbody").append(tempRow);
                    }
                }
            });
        });
    }
};
app.listHistoryFrame = {
    init: function () { },
    open: function (isbn) {
        alert(isbn);
    }
};
app.newFrame = app.searchFrame;

$(document).ready(function () {
    //保证该js只由main.html引用，只由main.html加载完时执行此处代码。
    app.init();
});