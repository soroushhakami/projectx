var Notification = function () {
    var e, n = "http://i.imgur.com/i56rnqe.png", i = function () {
        e = window.webkitNotifications.createNotification(n, "Pomodoro done", "Now take a break."), e.show()
    }, t = function () {
        e = window.webkitNotifications.createNotification(n, "Break done", "Now get back to work."), e.show()
    }, s = function () {
        window.webkitNotifications && window.webkitNotifications.requestPermission(function () {
            console.log(0 === window.webkitNotifications.checkPermission() ? "Has permissions for notifications " : "Didnt get permissions for notifications")
        })
    }, a = function () {
        e && e.close()
    };
    return{showPomodoroDone: i, showBreakDone: t, askForPermissions: s, closeNotification: a}
}(), Pair = function () {
    var e = new LacesModel;
    e.users = new LacesArray, e.users.bind("change", function () {
        Pair.isFullPair() ? $("#startBtn").removeAttr("disabled") : $("#startBtn").attr("disabled", "disabled")
    });
    var n = function (n) {
        var i = Users.getUser(n);
        e.users.push(i)
    }, i = function (n) {
        $.each(e.users, function (i, t) {
            return t.name == n ? (e.users.remove(i), !1) : void 0
        })
    }, t = function () {
        return 2 == e.users.length
    }, s = function (n) {
        var i = !1;
        return $.each(e.users, function (e, t) {
            t.name == n && (i = !0)
        }), i
    }, a = function () {
        return e.users
    }, r = function () {
        e.users.pop(), e.users.pop()
    };
    return{addUser: n, removeUser: i, emptyPair: r, hasUser: s, getUsers: a, isFullPair: t}
}(), Session = function () {
    var e = function (e, n) {
        $.getJSON("/saveSession?userOne=" + e + "&userTwo=" + n)
    };
    return{saveSession: e}
}(), StartPage = function () {
    var e = function () {
        $(document).attr("title", "Pairmodoro");
        var e = JST["views/clientside/start.hbs"]();
        $("#main_display").empty().append(e), Pair.emptyPair(), $.getJSON("/users", function (e) {
            $(e).each(function (e, n) {
                var i = JST["views/clientside/user.hbs"](n);
                $("#users").append(i), Users.addUser(n)
            }), $(".loading").hide(), n()
        })
    }, n = function () {
        $(".user").click(function () {
            var e = $(this).find(".avatar"), n = $(this).find(".name").text();
            Pair.isFullPair() ? Pair.hasUser(n) && (e.toggleClass("selected"), Pair.removeUser(n)) : (e.toggleClass("selected"), e.hasClass("selected") ? Pair.addUser(n) : Pair.removeUser(n))
        }), $(".chart-icon").click(function () {
            var e = $(this).parent().find(".name").text();
            StatsPage.render(e)
        }), $("#startBtn").click(function () {
            Notification.askForPermissions(), TimerPage.render()
        })
    };
    return{render: e}
}(), StatsPage = function () {
    var e = function (e) {
        $("#main_display").empty().append(JST["views/clientside/stats.hbs"]({name: e})), i();
        var t = {};
        $.getJSON("/getSessionsForUser?user=" + e, function (i) {
            $.each(i, function (n, i) {
                var s = i.users[0] == e ? i.users[1] : i.users[0];
                t[s] ? t[s] += 1 : t[s] = 1
            }), console.log(t), $(".loading").hide(), n(e, t)
        })
    }, n = function (e, n) {
        var i = [];
        $.each(n, function (e, n) {
            var t = e.length > 5 ? e.substring(0, 1) + "dog" : e;
            i.push({y: t, a: n})
        }), Morris.Bar({element: "statistics", data: i, xkey: "y", ykeys: "a", labels: ["Pomodoros finished"], barColors: ["rgb(0, 153, 221)"]})
    }, i = function () {
        $("#backBtn").click(function () {
            StartPage.render()
        })
    };
    return{render: e}
}();
this.JST = this.JST || {}, this.JST["views/clientside/start.hbs"] = Handlebars.template(function (e, n, i, t, s) {
    return this.compilerInfo = [2, ">= 1.0.0-rc.3"], i = i || e.helpers, s = s || {}, '        <div class="page-header"><h1>Pick a pair</h1>\n        </div>\n        <i class="loading icon-spinner icon-spin icon-2x"></i>\n        <div class="row-fluid" id="users">\n                </div>\n                <div class="actionbar">\n                <div class="buttons pull-right">\n                <button class="btn btn-large btn-primary btn-success" id="startBtn" type="button" disabled="disabled">Start Pomodoro</button>\n                </div>\n        </div>'
}), this.JST["views/clientside/stats.hbs"] = Handlebars.template(function (e, n, i, t, s) {
    this.compilerInfo = [2, ">= 1.0.0-rc.3"], i = i || e.helpers, s = s || {};
    var a, r = "", o = "function", c = this.escapeExpression;
    return r += '<div class="page-header"><h1>Stats for ', (a = i.name) ? a = a.call(n, {hash: {}, data: s}) : (a = n.name, a = typeof a === o ? a.apply(n) : a), r += c(a) + '</h1>\n        </div>\n        <i class="loading icon-spinner icon-spin icon-2x"></i>\n        <div id="statistics">\n        </div>\n        <div class="actionbar">\n            <div class="buttons pull-left">\n                <button class="btn btn-large btn-primary" id="backBtn" type="button">Back</button>\n            </div>\n        </div>'
}), this.JST["views/clientside/timer.hbs"] = Handlebars.template(function (e, n, i, t, s) {
    this.compilerInfo = [2, ">= 1.0.0-rc.3"], i = i || e.helpers, s = s || {};
    var a, r = "", o = "function", c = this.escapeExpression;
    return r += '<div class="page-header">\n            <h1 id="timerPageHeader">', (a = i.userOne) ? a = a.call(n, {hash: {}, data: s}) : (a = n.userOne, a = typeof a === o ? a.apply(n) : a), r += c(a) + " & ", (a = i.userTwo) ? a = a.call(n, {hash: {}, data: s}) : (a = n.userTwo, a = typeof a === o ? a.apply(n) : a), r += c(a) + '</h1>\n        </div>\n        <h1 class="timer"></h1>\n        <h1 id="timerMessage">Well done, now take a break.</h1>\n        <div class="actionbar">\n            <div class="buttons pull-left">\n                <button class="btn btn-large btn-primary" id="changePairBtn" type="button">Change Pair</button>\n            </div>\n            <div class="buttons pull-right">\n                <button class="btn btn-large btn-primary btn-success" id="pomodoroBtn" type="button">Start Pomodoro</button>\n        <button class="btn btn-large btn-primary btn-danger" id="breakBtn" type="button">Take a break</button>\n                </div>\n        </div>'
}), this.JST["views/clientside/user.hbs"] = Handlebars.template(function (e, n, i, t, s) {
    this.compilerInfo = [2, ">= 1.0.0-rc.3"], i = i || e.helpers, s = s || {};
    var a, r = "", o = "function", c = this.escapeExpression;
    return r += '<div class="span3 user">\n            <i class="chart-icon icon-bar-chart"></i>\n            <img src="', (a = i.image) ? a = a.call(n, {hash: {}, data: s}) : (a = n.image, a = typeof a === o ? a.apply(n) : a), r += c(a) + '" class="img-circle avatar">\n            <p class="name">', (a = i.name) ? a = a.call(n, {hash: {}, data: s}) : (a = n.name, a = typeof a === o ? a.apply(n) : a), r += c(a) + "</p>\n        </div>"
});
var Timer = function () {
    function e(e, n) {
        var i = moment(e.asMilliseconds()).format("mm:ss");
        n && (i = "- " + i), $(".timer").text(i), $(document).attr("title", i)
    }

    function n(e) {
        return 0 === e.minutes() && 0 === e.seconds()
    }

    var i, t = function () {
        $("#timerMessage").css("visibility", "hidden"), a()
    }, s = function () {
        $("#timerMessage").css("visibility", "hidden"), $(".timer").removeClass("red"), r()
    }, a = function () {
        var t = moment.duration(25, "minutes");
        e(t), i = setInterval(function () {
            t = moment.duration(t.asSeconds() - 1, "seconds"), n(t) && c(), e(t)
        }, 1e3)
    }, r = function () {
        var t = moment.duration(5, "minutes");
        e(t), i = setInterval(function () {
            t = moment.duration(t.asSeconds() - 1, "seconds"), n(t) && d(), e(t)
        }, 1e3)
    }, o = function () {
        $(".timer").addClass("red");
        var n = moment.duration(0, "seconds");
        e(n, !0), i = setInterval(function () {
            n = moment.duration(n.asSeconds() + 1, "seconds"), e(n, !0)
        }, 1e3)
    }, c = function () {
        u(), $("#timerMessage").css("visibility", "visible").hide().fadeIn("slow"), Notification.showPomodoroDone();
        var e = Pair.getUsers();
        Session.saveSession(e[0].name, e[1].name)
    }, d = function () {
        u(), $("#timerMessage").text("Break over, switch driver.").css("visibility", "visible").hide().fadeIn("slow"), o(), Notification.showBreakDone()
    }, u = function () {
        clearTimeout(i)
    };
    return{startPomodoro: t, startBreak: s, killTimer: u}
}(), TimerPage = function () {
    var e = function () {
        var e = Pair.getUsers();
        $("#main_display").empty().append(JST["views/clientside/timer.hbs"]({userOne: e[0].name, userTwo: e[1].name})), Timer.startPomodoro(), n()
    }, n = function () {
        $("#pomodoroBtn").click(function () {
            Timer.killTimer(), Notification.closeNotification(), TimerPage.render()
        }), $("#breakBtn").click(function () {
            Timer.killTimer(), Notification.closeNotification(), Timer.startBreak()
        }), $("#changePairBtn").click(function () {
            Notification.closeNotification(), Timer.killTimer(), StartPage.render()
        })
    };
    return{render: e}
}(), Users = function () {
    var e = new LacesMap;
    e.bind("change", function () {
    });
    var n = function (n) {
        var i = new LacesModel({name: n.name, image: n.image});
        e.set(n.name, i)
    }, i = function (n) {
        return e.get(n)
    };
    return{addUser: n, getUser: i}
}();