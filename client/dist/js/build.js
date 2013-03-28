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
;
/*
 countdown.js v2.3.0 http://countdownjs.org
 Copyright (c)2006-2012 Stephen M. McKamey.
 Licensed under The MIT License.
 */
var module, countdown = function (n) {
    function r(a, b) {
        var c = a.getTime();
        a.setUTCMonth(a.getUTCMonth() + b);
        return Math.round((a.getTime() - c) / 864E5)
    }

    function q(a) {
        var b = a.getTime(), c = new Date(b);
        c.setUTCMonth(a.getUTCMonth() + 1);
        return Math.round((c.getTime() - b) / 864E5)
    }

    function i(a, b, c) {
        return a + " " + (1 === a ? b : c)
    }

    function m() {
    }

    function k(a, b, c, d, f, j) {
        0 <= a[c] && (b += a[c], delete a[c]);
        b /= f;
        if (1 >= b + 1)return 0;
        if (0 <= a[d]) {
            a[d] = +(a[d] + b).toFixed(j);
            switch (d) {
                case "seconds":
                    if (60 !== a.seconds || isNaN(a.minutes))break;
                    a.minutes++;
                    a.seconds = 0;
                case "minutes":
                    if (60 !== a.minutes || isNaN(a.hours))break;
                    a.hours++;
                    a.minutes = 0;
                case "hours":
                    if (24 !== a.hours || isNaN(a.days))break;
                    a.days++;
                    a.hours = 0;
                case "days":
                    if (7 !== a.days || isNaN(a.weeks))break;
                    a.weeks++;
                    a.days = 0;
                case "weeks":
                    if (a.weeks !== q(a.refMonth) / 7 || isNaN(a.months))break;
                    a.months++;
                    a.weeks = 0;
                case "months":
                    if (12 !== a.months || isNaN(a.years))break;
                    a.years++;
                    a.months = 0;
                case "years":
                    if (10 !== a.years || isNaN(a.decades))break;
                    a.decades++;
                    a.years = 0;
                case "decades":
                    if (10 !== a.decades ||
                        isNaN(a.centuries))break;
                    a.centuries++;
                    a.decades = 0;
                case "centuries":
                    if (10 !== a.centuries || isNaN(a.millennia))break;
                    a.millennia++;
                    a.centuries = 0
            }
            return 0
        }
        return b
    }

    function s(a, b, c, d, f, j) {
        a.start = b;
        a.end = c;
        a.units = d;
        a.value = c.getTime() - b.getTime();
        if (0 > a.value)var e = c, c = b, b = e;
        a.refMonth = new Date(b.getFullYear(), b.getMonth(), 15);
        try {
            a.millennia = 0;
            a.centuries = 0;
            a.decades = 0;
            a.years = c.getUTCFullYear() - b.getUTCFullYear();
            a.months = c.getUTCMonth() - b.getUTCMonth();
            a.weeks = 0;
            a.days = c.getUTCDate() - b.getUTCDate();
            a.hours = c.getUTCHours() - b.getUTCHours();
            a.minutes = c.getUTCMinutes() - b.getUTCMinutes();
            a.seconds = c.getUTCSeconds() - b.getUTCSeconds();
            a.milliseconds = c.getUTCMilliseconds() - b.getUTCMilliseconds();
            var h;
            0 > a.milliseconds ? (h = p(-a.milliseconds / 1E3), a.seconds -= h, a.milliseconds += 1E3 * h) : 1E3 <= a.milliseconds && (a.seconds += l(a.milliseconds / 1E3), a.milliseconds %= 1E3);
            0 > a.seconds ? (h = p(-a.seconds / 60), a.minutes -= h, a.seconds += 60 * h) : 60 <= a.seconds && (a.minutes += l(a.seconds / 60), a.seconds %= 60);
            0 > a.minutes ? (h = p(-a.minutes /
                60), a.hours -= h, a.minutes += 60 * h) : 60 <= a.minutes && (a.hours += l(a.minutes / 60), a.minutes %= 60);
            0 > a.hours ? (h = p(-a.hours / 24), a.days -= h, a.hours += 24 * h) : 24 <= a.hours && (a.days += l(a.hours / 24), a.hours %= 24);
            for (; 0 > a.days;)a.months--, a.days += r(a.refMonth, 1);
            7 <= a.days && (a.weeks += l(a.days / 7), a.days %= 7);
            0 > a.months ? (h = p(-a.months / 12), a.years -= h, a.months += 12 * h) : 12 <= a.months && (a.years += l(a.months / 12), a.months %= 12);
            10 <= a.years && (a.decades += l(a.years / 10), a.years %= 10, 10 <= a.decades && (a.centuries += l(a.decades / 10), a.decades %=
                10, 10 <= a.centuries && (a.millennia += l(a.centuries / 10), a.centuries %= 10)));
            b = 0;
            !(d & 1024) || b >= f ? (a.centuries += 10 * a.millennia, delete a.millennia) : a.millennia && b++;
            !(d & 512) || b >= f ? (a.decades += 10 * a.centuries, delete a.centuries) : a.centuries && b++;
            !(d & 256) || b >= f ? (a.years += 10 * a.decades, delete a.decades) : a.decades && b++;
            !(d & 128) || b >= f ? (a.months += 12 * a.years, delete a.years) : a.years && b++;
            !(d & 64) || b >= f ? (a.months && (a.days += r(a.refMonth, a.months)), delete a.months, 7 <= a.days && (a.weeks += l(a.days / 7), a.days %= 7)) : a.months &&
                b++;
            !(d & 32) || b >= f ? (a.days += 7 * a.weeks, delete a.weeks) : a.weeks && b++;
            !(d & 16) || b >= f ? (a.hours += 24 * a.days, delete a.days) : a.days && b++;
            !(d & 8) || b >= f ? (a.minutes += 60 * a.hours, delete a.hours) : a.hours && b++;
            !(d & 4) || b >= f ? (a.seconds += 60 * a.minutes, delete a.minutes) : a.minutes && b++;
            !(d & 2) || b >= f ? (a.milliseconds += 1E3 * a.seconds, delete a.seconds) : a.seconds && b++;
            if (!(d & 1) || b >= f) {
                var g = k(a, 0, "milliseconds", "seconds", 1E3, j);
                if (g && (g = k(a, g, "seconds", "minutes", 60, j)))if (g = k(a, g, "minutes", "hours", 60, j))if (g = k(a, g, "hours", "days",
                    24, j))if (g = k(a, g, "days", "weeks", 7, j))if (g = k(a, g, "weeks", "months", q(a.refMonth) / 7, j)) {
                    var d = g, i, m = a.refMonth, n = m.getTime(), o = new Date(n);
                    o.setUTCFullYear(m.getUTCFullYear() + 1);
                    i = Math.round((o.getTime() - n) / 864E5);
                    if (g = k(a, d, "months", "years", i / q(a.refMonth), j))if (g = k(a, g, "years", "decades", 10, j))if (g = k(a, g, "decades", "centuries", 10, j))if (g = k(a, g, "centuries", "millennia", 10, j))throw Error("Fractional unit overflow");
                }
            }
        } finally {
            delete a.refMonth
        }
        return a
    }

    function e(a, b, c, d, f) {
        var e, c = +c || 222, d = 0 < d ? d : NaN,
            f = 0 < f ? 20 > f ? Math.round(f) : 20 : 0;
        "function" === typeof a ? (e = a, a = null) : a instanceof Date || (a = null !== a && isFinite(a) ? new Date(a) : null);
        "function" === typeof b ? (e = b, b = null) : b instanceof Date || (b = null !== b && isFinite(b) ? new Date(b) : null);
        if (!a && !b)return new m;
        if (!e)return s(new m, a || new Date, b || new Date, c, d, f);
        var i;
        i = c & 1 ? 1E3 / 30 : c & 2 ? 1E3 : c & 4 ? 6E4 : c & 8 ? 36E5 : c & 16 ? 864E5 : 6048E5;
        var h = function () {
            e(s(new m, a || new Date, b || new Date, c, d, f))
        };
        h();
        return setInterval(h, i)
    }

    var p = Math.ceil, l = Math.floor, o;
    m.prototype.toString =
        function () {
            var a = o(this), b = a.length;
            if (!b)return"";
            1 < b && (a[b - 1] = "and " + a[b - 1]);
            return a.join(", ")
        };
    m.prototype.toHTML = function (a) {
        var a = a || "span", b = o(this), c = b.length;
        if (!c)return"";
        for (var d = 0; d < c; d++)b[d] = "<" + a + ">" + b[d] + "</" + a + ">";
        --c && (b[c] = "and " + b[c]);
        return b.join(", ")
    };
    o = function (a) {
        var b = [], c = a.millennia;
        c && b.push(i(c, "millennium", "millennia"));
        (c = a.centuries) && b.push(i(c, "century", "centuries"));
        (c = a.decades) && b.push(i(c, "decade", "decades"));
        (c = a.years) && b.push(i(c, "year", "years"));
        (c = a.months) &&
        b.push(i(c, "month", "months"));
        (c = a.weeks) && b.push(i(c, "week", "weeks"));
        (c = a.days) && b.push(i(c, "day", "days"));
        (c = a.hours) && b.push(i(c, "hour", "hours"));
        (c = a.minutes) && b.push(i(c, "minute", "minutes"));
        (c = a.seconds) && b.push(i(c, "second", "seconds"));
        (c = a.milliseconds) && b.push(i(c, "millisecond", "milliseconds"));
        return b
    };
    e.MILLISECONDS = 1;
    e.SECONDS = 2;
    e.MINUTES = 4;
    e.HOURS = 8;
    e.DAYS = 16;
    e.WEEKS = 32;
    e.MONTHS = 64;
    e.YEARS = 128;
    e.DECADES = 256;
    e.CENTURIES = 512;
    e.MILLENNIA = 1024;
    e.DEFAULTS = 222;
    e.ALL = 2047;
    n && n.exports && (n.exports =
        e);
    return e
}(module);
;// lib/handlebars/base.js
/*jshint eqnull:true*/
this.Handlebars = {}, function (e) {
    e.VERSION = "1.0.rc.1", e.helpers = {}, e.partials = {}, e.registerHelper = function (e, t, n) {
        n && (t.not = n), this.helpers[e] = t
    }, e.registerPartial = function (e, t) {
        this.partials[e] = t
    }, e.registerHelper("helperMissing", function (e) {
        if (arguments.length === 2)return undefined;
        throw new Error("Could not find property '" + e + "'")
    });
    var t = Object.prototype.toString, n = "[object Function]";
    e.registerHelper("blockHelperMissing", function (r, i) {
        var s = i.inverse || function () {
        }, o = i.fn, u = "", a = t.call(r);
        return a === n && (r = r.call(this)), r === !0 ? o(this) : r === !1 || r == null ? s(this) : a === "[object Array]" ? r.length > 0 ? e.helpers.each(r, i) : s(this) : o(r)
    }), e.K = function () {
    }, e.createFrame = Object.create || function (t) {
        e.K.prototype = t;
        var n = new e.K;
        return e.K.prototype = null, n
    }, e.registerHelper("each", function (t, n) {
        var r = n.fn, i = n.inverse, s = 0, o = "", u;
        n.data && (u = e.createFrame(n.data));
        if (t && typeof t == "object")if (t instanceof Array)for (var a = t.length; s < a; s++)u && (u.index = s), o += r(t[s], {data: u}); else for (var f in t)t.hasOwnProperty(f) && (u && (u.key = f), o += r(t[f], {data: u}), s++);
        return s === 0 && (o = i(this)), o
    }), e.registerHelper("if", function (r, i) {
        var s = t.call(r);
        return s === n && (r = r.call(this)), !r || e.Utils.isEmpty(r) ? i.inverse(this) : i.fn(this)
    }), e.registerHelper("unless", function (t, n) {
        var r = n.fn, i = n.inverse;
        return n.fn = i, n.inverse = r, e.helpers["if"].call(this, t, n)
    }), e.registerHelper("with", function (e, t) {
        return t.fn(e)
    }), e.registerHelper("log", function (t) {
        e.log(t)
    })
}(this.Handlebars);
var errorProps = ["description", "fileName", "lineNumber", "message", "name", "number", "stack"];
Handlebars.Exception = function (e) {
    var t = Error.prototype.constructor.apply(this, arguments);
    for (var n = 0; n < errorProps.length; n++)this[errorProps[n]] = t[errorProps[n]]
}, Handlebars.Exception.prototype = new Error, Handlebars.SafeString = function (e) {
    this.string = e
}, Handlebars.SafeString.prototype.toString = function () {
    return this.string.toString()
}, function () {
    var e = {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;", "`": "&#x60;"}, t = /[&<>"'`]/g, n = /[&<>"'`]/, r = function (t) {
        return e[t] || "&amp;"
    };
    Handlebars.Utils = {escapeExpression: function (e) {
        return e instanceof Handlebars.SafeString ? e.toString() : e == null || e === !1 ? "" : n.test(e) ? e.replace(t, r) : e
    }, isEmpty: function (e) {
        return typeof e == "undefined" ? !0 : e === null ? !0 : e === !1 ? !0 : Object.prototype.toString.call(e) === "[object Array]" && e.length === 0 ? !0 : !1
    }}
}(), Handlebars.VM = {template: function (e) {
    var t = {escapeExpression: Handlebars.Utils.escapeExpression, invokePartial: Handlebars.VM.invokePartial, programs: [], program: function (e, t, n) {
        var r = this.programs[e];
        return n ? Handlebars.VM.program(t, n) : r ? r : (r = this.programs[e] = Handlebars.VM.program(t), r)
    }, programWithDepth: Handlebars.VM.programWithDepth, noop: Handlebars.VM.noop};
    return function (n, r) {
        return r = r || {}, e.call(t, Handlebars, n, r.helpers, r.partials, r.data)
    }
}, programWithDepth: function (e, t, n) {
    var r = Array.prototype.slice.call(arguments, 2);
    return function (n, i) {
        return i = i || {}, e.apply(this, [n, i.data || t].concat(r))
    }
}, program: function (e, t) {
    return function (n, r) {
        return r = r || {}, e(n, r.data || t)
    }
}, noop: function () {
    return""
}, invokePartial: function (e, t, n, r, i, s) {
    var o = {helpers: r, partials: i, data: s};
    if (e === undefined)throw new Handlebars.Exception("The partial " + t + " could not be found");
    if (e instanceof Function)return e(n, o);
    if (!Handlebars.compile)throw new Handlebars.Exception("The partial " + t + " could not be compiled when running in runtime-only mode");
    return i[t] = Handlebars.compile(e, {data: s !== undefined}), i[t](n, o)
}}, Handlebars.template = Handlebars.VM.template;
;
/* 
 * Wallpaper - Adds a smooth-scaling, page-filling background
 * @author Ben Plum
 * @version 1.3.5
 *
 * Copyright © 2012 Ben Plum <mr@benplum.com>
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */

if (jQuery)(function (b) {
    function p(c) {
        a = b.extend(a, c);
        c = b("body");
        1 > c.find("#wallpaper").length && ("document" == a.fitting && (c.wrapInner('<div id="wallpaper_content" style="overflow: hidden; position: relative;"></div>'), a.$content = b("#wallpaper_content")), c.append('<div id="wallpaper"></div>'), a.$wallpaper = b("#wallpaper"), a.$wallpaper.css({overflow: "hidden", minWidth: a.minWidth, top: 0, width: "100%", zIndex: -1, "-webkit-transition": "none", "-moz-transition": "none", "-o-transition": "none", "-ms-transition": "none", transition: "none"}), "document" == a.fitting ? a.$wallpaper.css({position: "absolute"}) : a.$wallpaper.css({height: "100%", position: "fixed"}), b(window).on("resize.wallpaper", q).one("load", function () {
            b(window).trigger("resize.wallpaper")
        }), l(a.file), a.onReady.call())
    }

    function l(c) {
        if (a.$wallpaper.find("img").attr("src") != c && !1 === g) {
            g = !0;
            var d = b("<img />");
            d.one("load",function () {
                1 > a.$wallpaper.find("img").length ? (d.appendTo(a.$wallpaper), g = !1) : d.css({opacity: 0, "-webkit-transition": "none", "-moz-transition": "none", "-o-transition": "none", "-ms-transition": "none", transition: "none"}).appendTo(a.$wallpaper).animate({opacity: 1}, a.speed, function () {
                    a.$wallpaper.find("img").not(":last").remove();
                    g = !1
                });
                d.css({left: "0", position: "absolute", top: "0"});
                m(d);
                a.onLoad.call()
            }).attr("src", c);
            d[0].complete && d.trigger("load")
        }
    }

    function q() {
        $imgs = b("#wallpaper img");
        for (var a = 0, d = $imgs.length; a < d; a++)m($imgs.eq(0))
    }

    function m(c) {
        var d, f, h, k;
        d = b(window).width();
        var j = "document" == a.fitting ? b(document).height() : b(window).height(), e = c[0].width;
        f = c[0].height;
        var g = e / f;
        k = h = 0;
        f = j;
        e = f * g;
        e < d && (e = d, f = e / g);
        h = (e - d) / 2;
        k = (f - j) / 2;
        "window" == a.fitting && 0 < b(document).scrollLeft() && (h += b(document).scrollLeft());
        d = parseInt(e, 10);
        f = parseInt(f, 10);
        h = parseInt(h, 10);
        k = parseInt(k, 10);
        0 < c.length && ("window" == a.fitting ? (j = b(window).height(), c.css({top: -k})) : (b(document).height(), e = b(window).height(), j = a.$content.outerHeight(!0), e > j && (j = e)), c.css({height: f, width: d, left: -h, top: -k}), a.$wallpaper.css({height: j}))
    }

    var a = {file: null, fitting: "window", speed: "500", minWidth: !1, onReady: function () {
    }, onLoad: function () {
    }}, g = !1, n = {update: function (a) {
        l(a)
    }, destroy: function () {
        var c = b("body");
        c.trigger("wallpaper.beforeDestroy");
        "document" == a.fitting && (c.append(a.$content.html()), a.$content.remove(), a.$content = null);
        a.$wallpaper.remove();
        a.$wallpaper = null;
        b(window).off(".wallpaper");
        c.trigger("wallpaper.afterDestroy")
    }};
    b.wallpaper = function (a) {
        return n[a] ? n[a].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" === typeof a || !a ? p.apply(this, arguments) : this
    }
})(jQuery);
;
(function (e) {
    "use strict";
    function t(e) {
        Object.defineProperty(this, "_bindings", {value: [], writable: !0}), Object.defineProperty(this, "_eventListeners", {value: {}, writable: !0}), Object.defineProperty(this, "_heldEvents", {value: null, writable: !0}), Object.defineProperty(this, "_options", {value: e || {}})
    }

    function i(e, i) {
        if (t.call(this, i), Object.defineProperty(this, "_values", {value: {}, writable: !0}), e)for (var n in e)e.hasOwnProperty(n) && this.set(n, e[n])
    }

    function n(e, t) {
        Object.defineProperty(this, "_functions", {value: {}, writable: !0}), i.call(this, e, t)
    }

    function s(e) {
        var i = [];
        for (var n in s.prototype)Object.defineProperty(i, n, {value: s.prototype[n], writable: !1});
        return t.call(i, e), i
    }

    t.prototype.bind = function (e, t, i) {
        if (i = i || {}, e.indexOf(" ") > -1) {
            for (var n = e.split(" "), s = 0, r = n.length; r > s; s++)this.bind(n[s], t);
            i.initialFire && this.fire(n[0], {})
        } else if (this._eventListeners.hasOwnProperty(e) || (this._eventListeners[e] = []), this._eventListeners[e].push(t), i.initialFire) {
            var o = {};
            if (e.indexOf(":") > -1) {
                var h = e.substr(e.indexOf(":") + 1);
                o.key = h, o.value = this[h]
            }
            this.fire(e, o)
        }
    }, t.prototype.fire = function (e, t) {
        var i, s = 0;
        if (e.indexOf(" ") > -1) {
            var r = e.split(" ");
            for (i = r.length; i > s; s++)this.fire(r[s], t)
        } else if (t = t || {}, t.name = e, this._heldEvents instanceof Array) {
            for (i = this._heldEvents.length; i > s; s++)if (this._heldEvents[s].name === e)return;
            this._heldEvents.push(t)
        } else {
            var o;
            if (this._eventListeners.hasOwnProperty(e))for (o = this._eventListeners[e], i = o.length; i > s; s++)o[s].call(this, t);
            if ("change" === e && t.key && this instanceof n && (e = "change:" + t.key, t.name = e, this._eventListeners.hasOwnProperty(e)))for (o = this._eventListeners[e], s = 0, i = o.length; i > s; s++)o[s].call(this, t)
        }
    }, t.prototype.log = function (e) {
        "undefined" != typeof console && console.log && console.log("laces.js: " + e)
    }, t.prototype.holdEvents = function () {
        this._heldEvents = []
    }, t.prototype.fireHeldEvents = function () {
        if (null === this._heldEvents)return this.log("Need a call to holdEvents() before calling fireHeldEvents()"), void 0;
        var e = this._heldEvents;
        this._heldEvents = null;
        for (var t = 0, i = e.length; i > t; t++) {
            var n = e[t];
            this.fire(n.name, n)
        }
    }, t.prototype.discardHeldEvents = function () {
        this._heldEvents = null
    }, t.prototype.unbind = function (e, t) {
        if ("function" == typeof e) {
            var i = !1;
            for (e in this._eventListeners)this._eventListeners.hasOwnProperty(e) && this.unbind(e, t) && (i = !0);
            return i
        }
        if (!this._eventListeners.hasOwnProperty(e))return!1;
        var n = this._eventListeners[e].indexOf(t);
        return n > -1 ? (this._eventListeners[e].splice(n, 1), !0) : !1
    }, t.prototype.wrap = function (e) {
        var t;
        if (e && e._gotLaces)t = e; else if (e instanceof Array) {
            t = new s(this._options);
            for (var n = 0, r = e.length; r > n; n++)t.set(n, e[n])
        } else t = e instanceof Function ? e : e instanceof Object ? new i(e, this._options) : e;
        return t
    }, t.prototype._gotLaces = !0, t.prototype._bindValue = function (e, t) {
        if (t && t._gotLaces) {
            var i = this, n = !1, s = function () {
                n || (n = !0, i.fire("change", {key: e, value: t}), n = !1)
            };
            t.bind("change", s), this._bindings.push(s)
        }
    }, t.prototype._unbindValue = function (e) {
        if (e && e._gotLaces)for (var t = 0, i = this._bindings.length; i > t; t++)if (e.unbind("change", this._bindings[t])) {
            this._bindings.splice(t, 1);
            break
        }
    }, i.prototype = new t, i.prototype.constructor = i, i.prototype.get = function (e) {
        return this._values[e]
    }, i.prototype.remove = function (e) {
        if (this._values.hasOwnProperty(e)) {
            var t = this._values[e];
            return this._unbindValue(t), delete this._values[e], delete this[e], this.fire("remove change", {key: e, oldValue: t}), !0
        }
        return!1
    }, i.prototype.set = function (e, t, i) {
        i = i || {};
        var n = this, s = function () {
            return this._values[e]
        }, r = function (t) {
            this._setValue(e, t)
        };
        i.type ? "boolean" === i.type ? r = function (t) {
            n._setValue(e, !!t)
        } : "float" === i.type || "number" === i.type ? r = function (t) {
            n._setValue(e, parseFloat(t, 10))
        } : "integer" === i.type ? r = function (t) {
            n._setValue(e, parseInt(t, 10))
        } : "string" === i.type && (r = function (t) {
            n._setValue(e, "" + t)
        }) : i.setFilter && (r = function (t) {
            try {
                n._setValue(e, i.setFilter(t))
            } catch (s) {
                n.log("Invalid value for property " + e + ": " + t)
            }
        }), Object.defineProperty(this, e, {get: s, set: r, configurable: !0, enumerable: !0}), r.call(this, t)
    }, i.prototype._setValue = function (e, t) {
        t = this.wrap(t);
        var i = {key: e, value: t}, n = !1;
        if (this._values.hasOwnProperty(e)) {
            var s = this._values[e];
            if (s === t)return;
            this._options.bindChildren !== !1 && this._unbindValue(s), i.oldValue = s
        } else n = !0;
        this._values[e] = t, this._options.bindChildren !== !1 && this._bindValue(e, t), n ? this.fire("add change", i) : this.fire("update change", i)
    }, n.prototype = new i, n.prototype.constructor = n, n.prototype.set = function (e, t, n) {
        if (n = n || {}, "function" == typeof t) {
            var s = n.dependencies || [];
            this._functions[e] = t;
            for (var r, o = "" + t, h = /this.(\w+)/g; null !== (r = h.exec(o));) {
                var a = r[1];
                -1 === s.indexOf(a) && s.push(a)
            }
            for (var l = 0, p = s.length; p > l; l++) {
                var u = s[l];
                this.bind("change:" + u, reevaluate)
            }
            t = t.call(this)
        }
        i.prototype.set.call(this, e, t, n)
    }, n.prototype._reevaluate = function (e) {
        var t = this._functions[e].call(this);
        this._setValue(e, t)
    }, s.prototype = new t, s.prototype.constructor = s, s.prototype.get = function (e) {
        return this[e]
    }, s.prototype.pop = function () {
        var e = Array.prototype.pop.call(this);
        return this._options.bindChildren !== !1 && this._unbindValue(e), this.fire("remove change", {elements: [e]}), e
    }, s.prototype.push = function () {
        for (var e = [], t = 0, i = arguments.length; i > t; t++) {
            var n = this.wrap(arguments[t]);
            this._options.bindChildren !== !1 && this._bindValue(this.length, n), e.push(n)
        }
        Array.prototype.push.apply(this, e), this.fire("add change", {elements: e})
    }, s.prototype.remove = function (e) {
        if (this.length > e) {
            var t = this[e];
            this._options.bindChildren !== !1 && this._unbindValue(t), Array.prototype.splice.call(this, e, 1), this.fire("remove change", {elements: [t]})
        }
    }, s.prototype.reverse = function () {
        Array.prototype.reverse.call(this), this.fire("change", {elements: []})
    }, s.prototype.set = function (e, t) {
        var i = !0;
        this.length > e && (this._options.bindChildren !== !1 && this._unbindValue(this[e]), i = !1), t = this.wrap(t), this[e] = t, this._options.bindChildren !== !1 && this._bindValue(e, t), i ? this.fire("add change", {elements: [t]}) : this.fire("update change", {elements: [t]})
    }, s.prototype.shift = function () {
        var e = Array.prototype.shift.call(this);
        return this._options.bindChildren !== !1 && this._unbindValue(e), this.fire("remove change", {elements: [e]}), e
    }, s.prototype.sort = function () {
        return Array.prototype.sort.call(this), this.fire("change", {elements: []}), this
    }, s.prototype.splice = function (e) {
        for (var t = Array.prototype.splice.apply(this, arguments), i = [], n = 2, s = arguments.length; s > n; n++)i.push(arguments[n]);
        if (t.length > 0) {
            if (this._options.bindChildren !== !1)for (n = 0, s = t.length; s > n; n++)this._unbindValue(t[n]);
            this.fire("remove change", {elements: t})
        }
        if (i.length > 0) {
            if (this._options.bindChildren !== !1)for (n = 0, s = i.length; s > n; n++)this._bindValue(e + n, i[j]);
            this.fire("add change", {elements: i})
        }
        return t
    }, s.prototype.unshift = function () {
        for (var e = [], t = 0, i = arguments.length; i > t; t++) {
            var n = this.wrap(arguments[t]);
            this._options.bindChildren !== !1 && this._bindValue(t, n), e.push(n)
        }
        return Array.prototype.unshift.apply(this, arguments), this.fire("add change", {elements: arguments}), this.length
    }, "function" == typeof define && define.amd ? define({Model: n, Map: i, Array: s}) : (e.LacesModel = n, e.LacesMap = i, e.LacesArray = s)
})(this);
;// moment.js
// version : 2.0.0
// author : Tim Wood
// license : MIT
// momentjs.com
(function (e) {
    function O(e, t) {
        return function (n) {
            return j(e.call(this, n), t)
        }
    }

    function M(e) {
        return function (t) {
            return this.lang().ordinal(e.call(this, t))
        }
    }

    function _() {
    }

    function D(e) {
        H(this, e)
    }

    function P(e) {
        var t = this._data = {}, n = e.years || e.year || e.y || 0, r = e.months || e.month || e.M || 0, i = e.weeks || e.week || e.w || 0, s = e.days || e.day || e.d || 0, o = e.hours || e.hour || e.h || 0, u = e.minutes || e.minute || e.m || 0, a = e.seconds || e.second || e.s || 0, f = e.milliseconds || e.millisecond || e.ms || 0;
        this._milliseconds = f + a * 1e3 + u * 6e4 + o * 36e5, this._days = s + i * 7, this._months = r + n * 12, t.milliseconds = f % 1e3, a += B(f / 1e3), t.seconds = a % 60, u += B(a / 60), t.minutes = u % 60, o += B(u / 60), t.hours = o % 24, s += B(o / 24), s += i * 7, t.days = s % 30, r += B(s / 30), t.months = r % 12, n += B(r / 12), t.years = n
    }

    function H(e, t) {
        for (var n in t)t.hasOwnProperty(n) && (e[n] = t[n]);
        return e
    }

    function B(e) {
        return e < 0 ? Math.ceil(e) : Math.floor(e)
    }

    function j(e, t) {
        var n = e + "";
        while (n.length < t)n = "0" + n;
        return n
    }

    function F(e, t, n) {
        var r = t._milliseconds, i = t._days, s = t._months, o;
        r && e._d.setTime(+e + r * n), i && e.date(e.date() + i * n), s && (o = e.date(), e.date(1).month(e.month() + s * n).date(Math.min(o, e.daysInMonth())))
    }

    function I(e) {
        return Object.prototype.toString.call(e) === "[object Array]"
    }

    function q(e, t) {
        var n = Math.min(e.length, t.length), r = Math.abs(e.length - t.length), i = 0, s;
        for (s = 0; s < n; s++)~~e[s] !== ~~t[s] && i++;
        return i + r
    }

    function R(e, t) {
        return t.abbr = e, s[e] || (s[e] = new _), s[e].set(t), s[e]
    }

    function U(e) {
        return e ? (!s[e] && o && require("./lang/" + e), s[e]) : t.fn._lang
    }

    function z(e) {
        return e.match(/\[.*\]/) ? e.replace(/^\[|\]$/g, "") : e.replace(/\\/g, "")
    }

    function W(e) {
        var t = e.match(a), n, r;
        for (n = 0, r = t.length; n < r; n++)A[t[n]] ? t[n] = A[t[n]] : t[n] = z(t[n]);
        return function (i) {
            var s = "";
            for (n = 0; n < r; n++)s += typeof t[n].call == "function" ? t[n].call(i, e) : t[n];
            return s
        }
    }

    function X(e, t) {
        function r(t) {
            return e.lang().longDateFormat(t) || t
        }

        var n = 5;
        while (n-- && f.test(t))t = t.replace(f, r);
        return C[t] || (C[t] = W(t)), C[t](e)
    }

    function V(e) {
        switch (e) {
            case"DDDD":
                return p;
            case"YYYY":
                return d;
            case"YYYYY":
                return v;
            case"S":
            case"SS":
            case"SSS":
            case"DDD":
                return h;
            case"MMM":
            case"MMMM":
            case"dd":
            case"ddd":
            case"dddd":
            case"a":
            case"A":
                return m;
            case"X":
                return b;
            case"Z":
            case"ZZ":
                return g;
            case"T":
                return y;
            case"MM":
            case"DD":
            case"YY":
            case"HH":
            case"hh":
            case"mm":
            case"ss":
            case"M":
            case"D":
            case"d":
            case"H":
            case"h":
            case"m":
            case"s":
                return c;
            default:
                return new RegExp(e.replace("\\", ""))
        }
    }

    function $(e, t, n) {
        var r, i, s = n._a;
        switch (e) {
            case"M":
            case"MM":
                s[1] = t == null ? 0 : ~~t - 1;
                break;
            case"MMM":
            case"MMMM":
                r = U(n._l).monthsParse(t), r != null ? s[1] = r : n._isValid = !1;
                break;
            case"D":
            case"DD":
            case"DDD":
            case"DDDD":
                t != null && (s[2] = ~~t);
                break;
            case"YY":
                s[0] = ~~t + (~~t > 68 ? 1900 : 2e3);
                break;
            case"YYYY":
            case"YYYYY":
                s[0] = ~~t;
                break;
            case"a":
            case"A":
                n._isPm = (t + "").toLowerCase() === "pm";
                break;
            case"H":
            case"HH":
            case"h":
            case"hh":
                s[3] = ~~t;
                break;
            case"m":
            case"mm":
                s[4] = ~~t;
                break;
            case"s":
            case"ss":
                s[5] = ~~t;
                break;
            case"S":
            case"SS":
            case"SSS":
                s[6] = ~~(("0." + t) * 1e3);
                break;
            case"X":
                n._d = new Date(parseFloat(t) * 1e3);
                break;
            case"Z":
            case"ZZ":
                n._useUTC = !0, r = (t + "").match(x), r && r[1] && (n._tzh = ~~r[1]), r && r[2] && (n._tzm = ~~r[2]), r && r[0] === "+" && (n._tzh = -n._tzh, n._tzm = -n._tzm)
        }
        t == null && (n._isValid = !1)
    }

    function J(e) {
        var t, n, r = [];
        if (e._d)return;
        for (t = 0; t < 7; t++)e._a[t] = r[t] = e._a[t] == null ? t === 2 ? 1 : 0 : e._a[t];
        r[3] += e._tzh || 0, r[4] += e._tzm || 0, n = new Date(0), e._useUTC ? (n.setUTCFullYear(r[0], r[1], r[2]), n.setUTCHours(r[3], r[4], r[5], r[6])) : (n.setFullYear(r[0], r[1], r[2]), n.setHours(r[3], r[4], r[5], r[6])), e._d = n
    }

    function K(e) {
        var t = e._f.match(a), n = e._i, r, i;
        e._a = [];
        for (r = 0; r < t.length; r++)i = (V(t[r]).exec(n) || [])[0], i && (n = n.slice(n.indexOf(i) + i.length)), A[t[r]] && $(t[r], i, e);
        e._isPm && e._a[3] < 12 && (e._a[3] += 12), e._isPm === !1 && e._a[3] === 12 && (e._a[3] = 0), J(e)
    }

    function Q(e) {
        var t, n, r, i = 99, s, o, u;
        while (e._f.length) {
            t = H({}, e), t._f = e._f.pop(), K(t), n = new D(t);
            if (n.isValid()) {
                r = n;
                break
            }
            u = q(t._a, n.toArray()), u < i && (i = u, r = n)
        }
        H(e, r)
    }

    function G(e) {
        var t, n = e._i;
        if (w.exec(n)) {
            e._f = "YYYY-MM-DDT";
            for (t = 0; t < 4; t++)if (S[t][1].exec(n)) {
                e._f += S[t][0];
                break
            }
            g.exec(n) && (e._f += " Z"), K(e)
        } else e._d = new Date(n)
    }

    function Y(t) {
        var n = t._i, r = u.exec(n);
        n === e ? t._d = new Date : r ? t._d = new Date(+r[1]) : typeof n == "string" ? G(t) : I(n) ? (t._a = n.slice(0), J(t)) : t._d = n instanceof Date ? new Date(+n) : new Date(n)
    }

    function Z(e, t, n, r, i) {
        return i.relativeTime(t || 1, !!n, e, r)
    }

    function et(e, t, n) {
        var i = r(Math.abs(e) / 1e3), s = r(i / 60), o = r(s / 60), u = r(o / 24), a = r(u / 365), f = i < 45 && ["s", i] || s === 1 && ["m"] || s < 45 && ["mm", s] || o === 1 && ["h"] || o < 22 && ["hh", o] || u === 1 && ["d"] || u <= 25 && ["dd", u] || u <= 45 && ["M"] || u < 345 && ["MM", r(u / 30)] || a === 1 && ["y"] || ["yy", a];
        return f[2] = t, f[3] = e > 0, f[4] = n, Z.apply({}, f)
    }

    function tt(e, n, r) {
        var i = r - n, s = r - e.day();
        return s > i && (s -= 7), s < i - 7 && (s += 7), Math.ceil(t(e).add("d", s).dayOfYear() / 7)
    }

    function nt(e) {
        var n = e._i, r = e._f;
        return n === null || n === "" ? null : (typeof n == "string" && (e._i = n = U().preparse(n)), t.isMoment(n) ? (e = H({}, n), e._d = new Date(+n._d)) : r ? I(r) ? Q(e) : K(e) : Y(e), new D(e))
    }

    function rt(e, n) {
        t.fn[e] = t.fn[e + "s"] = function (e) {
            var t = this._isUTC ? "UTC" : "";
            return e != null ? (this._d["set" + t + n](e), this) : this._d["get" + t + n]()
        }
    }

    function it(e) {
        t.duration.fn[e] = function () {
            return this._data[e]
        }
    }

    function st(e, n) {
        t.duration.fn["as" + e] = function () {
            return+this / n
        }
    }

    var t, n = "2.0.0", r = Math.round, i, s = {}, o = typeof module != "undefined" && module.exports, u = /^\/?Date\((\-?\d+)/i, a = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYY|YYYY|YY|a|A|hh?|HH?|mm?|ss?|SS?S?|X|zz?|ZZ?|.)/g, f = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g, l = /([0-9a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)/gi, c = /\d\d?/, h = /\d{1,3}/, p = /\d{3}/, d = /\d{1,4}/, v = /[+\-]?\d{1,6}/, m = /[0-9]*[a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF]+\s*?[\u0600-\u06FF]+/i, g = /Z|[\+\-]\d\d:?\d\d/i, y = /T/i, b = /[\+\-]?\d+(\.\d{1,3})?/, w = /^\s*\d{4}-\d\d-\d\d((T| )(\d\d(:\d\d(:\d\d(\.\d\d?\d?)?)?)?)?([\+\-]\d\d:?\d\d)?)?/, E = "YYYY-MM-DDTHH:mm:ssZ", S = [
        ["HH:mm:ss.S", /(T| )\d\d:\d\d:\d\d\.\d{1,3}/],
        ["HH:mm:ss", /(T| )\d\d:\d\d:\d\d/],
        ["HH:mm", /(T| )\d\d:\d\d/],
        ["HH", /(T| )\d\d/]
    ], x = /([\+\-]|\d\d)/gi, T = "Month|Date|Hours|Minutes|Seconds|Milliseconds".split("|"), N = {Milliseconds: 1, Seconds: 1e3, Minutes: 6e4, Hours: 36e5, Days: 864e5, Months: 2592e6, Years: 31536e6}, C = {}, k = "DDD w W M D d".split(" "), L = "M D H h m s w W".split(" "), A = {M: function () {
        return this.month() + 1
    }, MMM: function (e) {
        return this.lang().monthsShort(this, e)
    }, MMMM: function (e) {
        return this.lang().months(this, e)
    }, D: function () {
        return this.date()
    }, DDD: function () {
        return this.dayOfYear()
    }, d: function () {
        return this.day()
    }, dd: function (e) {
        return this.lang().weekdaysMin(this, e)
    }, ddd: function (e) {
        return this.lang().weekdaysShort(this, e)
    }, dddd: function (e) {
        return this.lang().weekdays(this, e)
    }, w: function () {
        return this.week()
    }, W: function () {
        return this.isoWeek()
    }, YY: function () {
        return j(this.year() % 100, 2)
    }, YYYY: function () {
        return j(this.year(), 4)
    }, YYYYY: function () {
        return j(this.year(), 5)
    }, a: function () {
        return this.lang().meridiem(this.hours(), this.minutes(), !0)
    }, A: function () {
        return this.lang().meridiem(this.hours(), this.minutes(), !1)
    }, H: function () {
        return this.hours()
    }, h: function () {
        return this.hours() % 12 || 12
    }, m: function () {
        return this.minutes()
    }, s: function () {
        return this.seconds()
    }, S: function () {
        return~~(this.milliseconds() / 100)
    }, SS: function () {
        return j(~~(this.milliseconds() / 10), 2)
    }, SSS: function () {
        return j(this.milliseconds(), 3)
    }, Z: function () {
        var e = -this.zone(), t = "+";
        return e < 0 && (e = -e, t = "-"), t + j(~~(e / 60), 2) + ":" + j(~~e % 60, 2)
    }, ZZ: function () {
        var e = -this.zone(), t = "+";
        return e < 0 && (e = -e, t = "-"), t + j(~~(10 * e / 6), 4)
    }, X: function () {
        return this.unix()
    }};
    while (k.length)i = k.pop(), A[i + "o"] = M(A[i]);
    while (L.length)i = L.pop(), A[i + i] = O(A[i], 2);
    A.DDDD = O(A.DDD, 3), _.prototype = {set: function (e) {
        var t, n;
        for (n in e)t = e[n], typeof t == "function" ? this[n] = t : this["_" + n] = t
    }, _months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), months: function (e) {
        return this._months[e.month()]
    }, _monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"), monthsShort: function (e) {
        return this._monthsShort[e.month()]
    }, monthsParse: function (e) {
        var n, r, i, s;
        this._monthsParse || (this._monthsParse = []);
        for (n = 0; n < 12; n++) {
            this._monthsParse[n] || (r = t([2e3, n]), i = "^" + this.months(r, "") + "|^" + this.monthsShort(r, ""), this._monthsParse[n] = new RegExp(i.replace(".", ""), "i"));
            if (this._monthsParse[n].test(e))return n
        }
    }, _weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), weekdays: function (e) {
        return this._weekdays[e.day()]
    }, _weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"), weekdaysShort: function (e) {
        return this._weekdaysShort[e.day()]
    }, _weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"), weekdaysMin: function (e) {
        return this._weekdaysMin[e.day()]
    }, _longDateFormat: {LT: "h:mm A", L: "MM/DD/YYYY", LL: "MMMM D YYYY", LLL: "MMMM D YYYY LT", LLLL: "dddd, MMMM D YYYY LT"}, longDateFormat: function (e) {
        var t = this._longDateFormat[e];
        return!t && this._longDateFormat[e.toUpperCase()] && (t = this._longDateFormat[e.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function (e) {
            return e.slice(1)
        }), this._longDateFormat[e] = t), t
    }, meridiem: function (e, t, n) {
        return e > 11 ? n ? "pm" : "PM" : n ? "am" : "AM"
    }, _calendar: {sameDay: "[Today at] LT", nextDay: "[Tomorrow at] LT", nextWeek: "dddd [at] LT", lastDay: "[Yesterday at] LT", lastWeek: "[last] dddd [at] LT", sameElse: "L"}, calendar: function (e, t) {
        var n = this._calendar[e];
        return typeof n == "function" ? n.apply(t) : n
    }, _relativeTime: {future: "in %s", past: "%s ago", s: "a few seconds", m: "a minute", mm: "%d minutes", h: "an hour", hh: "%d hours", d: "a day", dd: "%d days", M: "a month", MM: "%d months", y: "a year", yy: "%d years"}, relativeTime: function (e, t, n, r) {
        var i = this._relativeTime[n];
        return typeof i == "function" ? i(e, t, n, r) : i.replace(/%d/i, e)
    }, pastFuture: function (e, t) {
        var n = this._relativeTime[e > 0 ? "future" : "past"];
        return typeof n == "function" ? n(t) : n.replace(/%s/i, t)
    }, ordinal: function (e) {
        return this._ordinal.replace("%d", e)
    }, _ordinal: "%d", preparse: function (e) {
        return e
    }, postformat: function (e) {
        return e
    }, week: function (e) {
        return tt(e, this._week.dow, this._week.doy)
    }, _week: {dow: 0, doy: 6}}, t = function (e, t, n) {
        return nt({_i: e, _f: t, _l: n, _isUTC: !1})
    }, t.utc = function (e, t, n) {
        return nt({_useUTC: !0, _isUTC: !0, _l: n, _i: e, _f: t})
    }, t.unix = function (e) {
        return t(e * 1e3)
    }, t.duration = function (e, n) {
        var r = t.isDuration(e), i = typeof e == "number", s = r ? e._data : i ? {} : e, o;
        return i && (n ? s[n] = e : s.milliseconds = e), o = new P(s), r && e.hasOwnProperty("_lang") && (o._lang = e._lang), o
    }, t.version = n, t.defaultFormat = E, t.lang = function (e, n) {
        var r;
        if (!e)return t.fn._lang._abbr;
        n ? R(e, n) : s[e] || U(e), t.duration.fn._lang = t.fn._lang = U(e)
    }, t.langData = function (e) {
        return e && e._lang && e._lang._abbr && (e = e._lang._abbr), U(e)
    }, t.isMoment = function (e) {
        return e instanceof D
    }, t.isDuration = function (e) {
        return e instanceof P
    }, t.fn = D.prototype = {clone: function () {
        return t(this)
    }, valueOf: function () {
        return+this._d
    }, unix: function () {
        return Math.floor(+this._d / 1e3)
    }, toString: function () {
        return this.format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")
    }, toDate: function () {
        return this._d
    }, toJSON: function () {
        return t.utc(this).format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
    }, toArray: function () {
        var e = this;
        return[e.year(), e.month(), e.date(), e.hours(), e.minutes(), e.seconds(), e.milliseconds()]
    }, isValid: function () {
        return this._isValid == null && (this._a ? this._isValid = !q(this._a, (this._isUTC ? t.utc(this._a) : t(this._a)).toArray()) : this._isValid = !isNaN(this._d.getTime())), !!this._isValid
    }, utc: function () {
        return this._isUTC = !0, this
    }, local: function () {
        return this._isUTC = !1, this
    }, format: function (e) {
        var n = X(this, e || t.defaultFormat);
        return this.lang().postformat(n)
    }, add: function (e, n) {
        var r;
        return typeof e == "string" ? r = t.duration(+n, e) : r = t.duration(e, n), F(this, r, 1), this
    }, subtract: function (e, n) {
        var r;
        return typeof e == "string" ? r = t.duration(+n, e) : r = t.duration(e, n), F(this, r, -1), this
    }, diff: function (e, n, r) {
        var i = this._isUTC ? t(e).utc() : t(e).local(), s = (this.zone() - i.zone()) * 6e4, o, u;
        return n && (n = n.replace(/s$/, "")), n === "year" || n === "month" ? (o = (this.daysInMonth() + i.daysInMonth()) * 432e5, u = (this.year() - i.year()) * 12 + (this.month() - i.month()), u += (this - t(this).startOf("month") - (i - t(i).startOf("month"))) / o, n === "year" && (u /= 12)) : (o = this - i - s, u = n === "second" ? o / 1e3 : n === "minute" ? o / 6e4 : n === "hour" ? o / 36e5 : n === "day" ? o / 864e5 : n === "week" ? o / 6048e5 : o), r ? u : B(u)
    }, from: function (e, n) {
        return t.duration(this.diff(e)).lang(this.lang()._abbr).humanize(!n)
    }, fromNow: function (e) {
        return this.from(t(), e)
    }, calendar: function () {
        var e = this.diff(t().startOf("day"), "days", !0), n = e < -6 ? "sameElse" : e < -1 ? "lastWeek" : e < 0 ? "lastDay" : e < 1 ? "sameDay" : e < 2 ? "nextDay" : e < 7 ? "nextWeek" : "sameElse";
        return this.format(this.lang().calendar(n, this))
    }, isLeapYear: function () {
        var e = this.year();
        return e % 4 === 0 && e % 100 !== 0 || e % 400 === 0
    }, isDST: function () {
        return this.zone() < t([this.year()]).zone() || this.zone() < t([this.year(), 5]).zone()
    }, day: function (e) {
        var t = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        return e == null ? t : this.add({d: e - t})
    }, startOf: function (e) {
        e = e.replace(/s$/, "");
        switch (e) {
            case"year":
                this.month(0);
            case"month":
                this.date(1);
            case"week":
            case"day":
                this.hours(0);
            case"hour":
                this.minutes(0);
            case"minute":
                this.seconds(0);
            case"second":
                this.milliseconds(0)
        }
        return e === "week" && this.day(0), this
    }, endOf: function (e) {
        return this.startOf(e).add(e.replace(/s?$/, "s"), 1).subtract("ms", 1)
    }, isAfter: function (e, n) {
        return n = typeof n != "undefined" ? n : "millisecond", +this.clone().startOf(n) > +t(e).startOf(n)
    }, isBefore: function (e, n) {
        return n = typeof n != "undefined" ? n : "millisecond", +this.clone().startOf(n) < +t(e).startOf(n)
    }, isSame: function (e, n) {
        return n = typeof n != "undefined" ? n : "millisecond", +this.clone().startOf(n) === +t(e).startOf(n)
    }, zone: function () {
        return this._isUTC ? 0 : this._d.getTimezoneOffset()
    }, daysInMonth: function () {
        return t.utc([this.year(), this.month() + 1, 0]).date()
    }, dayOfYear: function (e) {
        var n = r((t(this).startOf("day") - t(this).startOf("year")) / 864e5) + 1;
        return e == null ? n : this.add("d", e - n)
    }, isoWeek: function (e) {
        var t = tt(this, 1, 4);
        return e == null ? t : this.add("d", (e - t) * 7)
    }, week: function (e) {
        var t = this.lang().week(this);
        return e == null ? t : this.add("d", (e - t) * 7)
    }, lang: function (t) {
        return t === e ? this._lang : (this._lang = U(t), this)
    }};
    for (i = 0; i < T.length; i++)rt(T[i].toLowerCase().replace(/s$/, ""), T[i]);
    rt("year", "FullYear"), t.fn.days = t.fn.day, t.fn.weeks = t.fn.week, t.fn.isoWeeks = t.fn.isoWeek, t.duration.fn = P.prototype = {weeks: function () {
        return B(this.days() / 7)
    }, valueOf: function () {
        return this._milliseconds + this._days * 864e5 + this._months * 2592e6
    }, humanize: function (e) {
        var t = +this, n = et(t, !e, this.lang());
        return e && (n = this.lang().pastFuture(t, n)), this.lang().postformat(n)
    }, lang: t.fn.lang};
    for (i in N)N.hasOwnProperty(i) && (st(i, N[i]), it(i.toLowerCase()));
    st("Weeks", 6048e5), t.lang("en", {ordinal: function (e) {
        var t = e % 10, n = ~~(e % 100 / 10) === 1 ? "th" : t === 1 ? "st" : t === 2 ? "nd" : t === 3 ? "rd" : "th";
        return e + n
    }}), o && (module.exports = t), typeof ender == "undefined" && (this.moment = t), typeof define == "function" && define.amd && define("moment", [], function () {
        return t
    })
}).call(this);
;
(function () {
    var e, t, n, r, i = [].slice, s = {}.hasOwnProperty, o = function (e, t) {
        function r() {
            this.constructor = e
        }

        for (var n in t)s.call(t, n) && (e[n] = t[n]);
        return r.prototype = t.prototype, e.prototype = new r, e.__super__ = t.prototype, e
    }, u = function (e, t) {
        return function () {
            return e.apply(t, arguments)
        }
    }, a = [].indexOf || function (e) {
        for (var t = 0, n = this.length; t < n; t++)if (t in this && this[t] === e)return t;
        return-1
    };
    t = window.Morris = {}, e = jQuery, t.EventEmitter = function () {
        function e() {
        }

        return e.prototype.on = function (e, t) {
            return this.handlers == null && (this.handlers = {}), this.handlers[e] == null && (this.handlers[e] = []), this.handlers[e].push(t)
        }, e.prototype.fire = function () {
            var e, t, n, r, s, o, u;
            n = arguments[0], e = 2 <= arguments.length ? i.call(arguments, 1) : [];
            if (this.handlers != null && this.handlers[n] != null) {
                o = this.handlers[n], u = [];
                for (r = 0, s = o.length; r < s; r++)t = o[r], u.push(t.apply(null, e));
                return u
            }
        }, e
    }(), t.commas = function (e) {
        var t, n, r, i;
        return e === null ? "-" : (r = e < 0 ? "-" : "", t = Math.abs(e), n = Math.floor(t).toFixed(0), r += n.replace(/(?=(?:\d{3})+$)(?!^)/g, ","), i = t.toString(), i.length > n.length && (r += i.slice(n.length)), r)
    }, t.pad2 = function (e) {
        return(e < 10 ? "0" : "") + e
    }, t.Grid = function (n) {
        function r(t) {
            typeof t.element == "string" ? this.el = e(document.getElementById(t.element)) : this.el = e(t.element);
            if (this.el === null || this.el.length === 0)throw new Error("Graph container element not found");
            this.options = e.extend({}, this.gridDefaults, this.defaults || {}, t);
            if (this.options.data === void 0 || this.options.data.length === 0)return;
            typeof this.options.units == "string" && (this.options.postUnits = t.units), this.r = new Raphael(this.el[0]), this.elementWidth = null, this.elementHeight = null, this.dirty = !1, this.init && this.init(), this.setData(this.options.data)
        }

        return o(r, n), r.prototype.gridDefaults = {dateFormat: null, gridLineColor: "#aaa", gridStrokeWidth: .5, gridTextColor: "#888", gridTextSize: 12, numLines: 5, padding: 25, parseTime: !0, postUnits: "", preUnits: "", ymax: "auto", ymin: "auto 0"}, r.prototype.setData = function (n, r) {
            var i, s, o = this;
            r == null && (r = !0), i = this.cumulative ? 0 : null, s = this.cumulative ? 0 : null, this.data = e.map(n, function (e, n) {
                var r, u, a, f, l;
                return u = {}, u.label = e[o.options.xkey], o.options.parseTime ? (u.x = t.parseDate(u.label), o.options.dateFormat ? u.label = o.options.dateFormat(u.x) : typeof u.label == "number" && (u.label = (new Date(u.label)).toString())) : u.x = n, a = 0, u.y = function () {
                    var t, n, o, u;
                    o = this.options.ykeys, u = [];
                    for (r = t = 0, n = o.length; t < n; r = ++t)f = o[r], l = e[f], typeof l == "string" && (l = parseFloat(l)), typeof l != "number" && (l = null), l !== null && (this.cumulative ? a += l : i === null ? i = s = l : (i = Math.max(l, i), s = Math.min(l, s))), this.cumulative && a !== null && (i = Math.max(a, i), s = Math.min(a, s)), u.push(l);
                    return u
                }.call(o), u
            }), this.options.parseTime && (this.data = this.data.sort(function (e, t) {
                return(e.x > t.x) - (t.x > e.x)
            })), this.xmin = this.data[0].x, this.xmax = this.data[this.data.length - 1].x, this.xmin === this.xmax && (this.xmin -= 1, this.xmax += 1), typeof this.options.ymax == "string" ? this.options.ymax.slice(0, 4) === "auto" ? this.options.ymax.length > 5 ? (this.ymax = parseInt(this.options.ymax.slice(5), 10), i !== null && (this.ymax = Math.max(i, this.ymax))) : this.ymax = i !== null ? i : 0 : this.ymax = parseInt(this.options.ymax, 10) : this.ymax = this.options.ymax, typeof this.options.ymin == "string" ? this.options.ymin.slice(0, 4) === "auto" ? this.options.ymin.length > 5 ? (this.ymin = parseInt(this.options.ymin.slice(5), 10), s !== null && (this.ymin = Math.min(s, this.ymin))) : this.ymin = s !== null ? s : 0 : this.ymin = parseInt(this.options.ymin, 10) : this.ymin = this.options.ymin, this.ymin === this.ymax && (s && (this.ymin -= 1), this.ymax += 1), this.yInterval = (this.ymax - this.ymin) / (this.options.numLines - 1), this.yInterval > 0 && this.yInterval < 1 ? this.precision = -Math.floor(Math.log(this.yInterval) / Math.log(10)) : this.precision = 0, this.dirty = !0;
            if (r)return this.redraw()
        }, r.prototype._calc = function () {
            var e, t, n;
            n = this.el.width(), e = this.el.height();
            if (this.elementWidth !== n || this.elementHeight !== e || this.dirty) {
                this.elementWidth = n, this.elementHeight = e, this.dirty = !1, t = Math.max(this.measureText(this.yAxisFormat(this.ymin), this.options.gridTextSize).width, this.measureText(this.yAxisFormat(this.ymax), this.options.gridTextSize).width), this.left = t + this.options.padding, this.right = this.elementWidth - this.options.padding, this.top = this.options.padding, this.bottom = this.elementHeight - this.options.padding - 1.5 * this.options.gridTextSize, this.width = this.right - this.left, this.height = this.bottom - this.top, this.dx = this.width / (this.xmax - this.xmin), this.dy = this.height / (this.ymax - this.ymin);
                if (this.calc)return this.calc()
            }
        }, r.prototype.transY = function (e) {
            return this.bottom - (e - this.ymin) * this.dy
        }, r.prototype.transX = function (e) {
            return this.data.length === 1 ? (this.left + this.right) / 2 : this.left + (e - this.xmin) * this.dx
        }, r.prototype.redraw = function () {
            this.r.clear(), this._calc(), this.drawGrid();
            if (this.draw)return this.draw()
        }, r.prototype.drawGrid = function () {
            var e, t, n, r, i, s, o, u;
            e = this.ymin, t = this.ymax, u = [];
            for (n = s = e, o = this.yInterval; e <= t ? s <= t : s >= t; n = s += o)r = parseFloat(n.toFixed(this.precision)), i = this.transY(r), this.r.text(this.left - this.options.padding / 2, i, this.yAxisFormat(r)).attr("font-size", this.options.gridTextSize).attr("fill", this.options.gridTextColor).attr("text-anchor", "end"), u.push(this.r.path("M" + this.left + "," + i + "H" + (this.left + this.width)).attr("stroke", this.options.gridLineColor).attr("stroke-width", this.options.gridStrokeWidth));
            return u
        }, r.prototype.measureText = function (e, t) {
            var n, r;
            return t == null && (t = 12), r = this.r.text(100, 100, e).attr("font-size", t), n = r.getBBox(), r.remove(), n
        }, r.prototype.yAxisFormat = function (e) {
            return this.yLabelFormat(e)
        }, r.prototype.yLabelFormat = function (e) {
            return"" + this.options.preUnits + t.commas(e) + this.options.postUnits
        }, r
    }(t.EventEmitter), t.parseDate = function (e) {
        var t, n, r, i, s, o, u, a, f, l, c;
        return typeof e == "number" ? e : (n = e.match(/^(\d+) Q(\d)$/), i = e.match(/^(\d+)-(\d+)$/), s = e.match(/^(\d+)-(\d+)-(\d+)$/), u = e.match(/^(\d+) W(\d+)$/), a = e.match(/^(\d+)-(\d+)-(\d+)[ T](\d+):(\d+)(Z|([+-])(\d\d):?(\d\d))?$/), f = e.match(/^(\d+)-(\d+)-(\d+)[ T](\d+):(\d+):(\d+(\.\d+)?)(Z|([+-])(\d\d):?(\d\d))?$/), n ? (new Date(parseInt(n[1], 10), parseInt(n[2], 10) * 3 - 1, 1)).getTime() : i ? (new Date(parseInt(i[1], 10), parseInt(i[2], 10) - 1, 1)).getTime() : s ? (new Date(parseInt(s[1], 10), parseInt(s[2], 10) - 1, parseInt(s[3], 10))).getTime() : u ? (l = new Date(parseInt(u[1], 10), 0, 1), l.getDay() !== 4 && l.setMonth(0, 1 + (4 - l.getDay() + 7) % 7), l.getTime() + parseInt(u[2], 10) * 6048e5) : a ? a[6] ? (o = 0, a[6] !== "Z" && (o = parseInt(a[8], 10) * 60 + parseInt(a[9], 10), a[7] === "+" && (o = 0 - o)), Date.UTC(parseInt(a[1], 10), parseInt(a[2], 10) - 1, parseInt(a[3], 10), parseInt(a[4], 10), parseInt(a[5], 10) + o)) : (new Date(parseInt(a[1], 10), parseInt(a[2], 10) - 1, parseInt(a[3], 10), parseInt(a[4], 10), parseInt(a[5], 10))).getTime() : f ? (c = parseFloat(f[6]), t = Math.floor(c), r = Math.round((c - t) * 1e3), f[8] ? (o = 0, f[8] !== "Z" && (o = parseInt(f[10], 10) * 60 + parseInt(f[11], 10), f[9] === "+" && (o = 0 - o)), Date.UTC(parseInt(f[1], 10), parseInt(f[2], 10) - 1, parseInt(f[3], 10), parseInt(f[4], 10), parseInt(f[5], 10) + o, t, r)) : (new Date(parseInt(f[1], 10), parseInt(f[2], 10) - 1, parseInt(f[3], 10), parseInt(f[4], 10), parseInt(f[5], 10), t, r)).getTime()) : (new Date(parseInt(e, 10), 0, 1)).getTime())
    }, t.Line = function (n) {
        function r(e) {
            this.updateHilight = u(this.updateHilight, this), this.hilight = u(this.hilight, this), this.updateHover = u(this.updateHover, this);
            if (!(this instanceof t.Line))return new t.Line(e);
            r.__super__.constructor.call(this, e)
        }

        return o(r, n), r.prototype.init = function () {
            var e, t = this;
            return this.pointGrow = Raphael.animation({r: this.options.pointSize + 3}, 25, "linear"), this.pointShrink = Raphael.animation({r: this.options.pointSize}, 25, "linear"), this.prevHilight = null, this.el.mousemove(function (e) {
                return t.updateHilight(e.pageX)
            }), this.options.hideHover && this.el.mouseout(function (e) {
                return t.hilight(null)
            }), e = function (e) {
                var n;
                return n = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0], t.updateHilight(n.pageX), n
            }, this.el.bind("touchstart", e), this.el.bind("touchmove", e), this.el.bind("touchend", e)
        }, r.prototype.defaults = {lineWidth: 3, pointSize: 4, lineColors: ["#0b62a4", "#7A92A3", "#4da74d", "#afd8f8", "#edc240", "#cb4b4b", "#9440ed"], pointWidths: [1], pointStrokeColors: ["#ffffff"], pointFillColors: [], hoverPaddingX: 10, hoverPaddingY: 5, hoverMargin: 10, hoverFillColor: "#fff", hoverBorderColor: "#ccc", hoverBorderWidth: 2, hoverOpacity: .95, hoverLabelColor: "#444", hoverFontSize: 12, smooth: !0, hideHover: !1, xLabels: "auto", xLabelFormat: null}, r.prototype.calc = function () {
            return this.calcPoints(), this.generatePaths(), this.calcHoverMargins()
        }, r.prototype.calcPoints = function () {
            var e, t, n, r, i, s;
            i = this.data, s = [];
            for (n = 0, r = i.length; n < r; n++)e = i[n], e._x = this.transX(e.x), s.push(e._y = function () {
                var n, r, i, s;
                i = e.y, s = [];
                for (n = 0, r = i.length; n < r; n++)t = i[n], t === null ? s.push(null) : s.push(this.transY(t));
                return s
            }.call(this));
            return s
        }, r.prototype.calcHoverMargins = function () {
            var t = this;
            return this.hoverMargins = e.map(this.data.slice(1), function (e, n) {
                return(e._x + t.data[n]._x) / 2
            })
        }, r.prototype.generatePaths = function () {
            var e, t, n, r;
            return this.paths = function () {
                var i, s, o, u;
                u = [];
                for (t = i = 0, s = this.options.ykeys.length; 0 <= s ? i < s : i > s; t = 0 <= s ? ++i : --i)r = this.options.smooth === !0 || (o = this.options.ykeys[t], a.call(this.options.smooth, o) >= 0), e = function () {
                    var e, r, i, s;
                    i = this.data, s = [];
                    for (e = 0, r = i.length; e < r; e++)n = i[e], n._y[t] !== null && s.push({x: n._x, y: n._y[t]});
                    return s
                }.call(this), e.length > 1 ? u.push(this.createPath(e, r)) : u.push(null);
                return u
            }.call(this)
        }, r.prototype.draw = function () {
            return this.drawXAxis(), this.drawSeries(), this.drawHover(), this.hilight(this.options.hideHover ? null : this.data.length - 1)
        }, r.prototype.drawXAxis = function () {
            var e, n, r, i, s, o, u, a, f, l, c = this;
            u = this.bottom + this.options.gridTextSize * 1.25, o = 50, i = null, e = function (e, t) {
                var n, r;
                return n = c.r.text(c.transX(t), u, e).attr("font-size", c.options.gridTextSize).attr("fill", c.options.gridTextColor), r = n.getBBox(), (i === null || i >= r.x + r.width) && r.x >= 0 && r.x + r.width < c.el.width() ? i = r.x - o : n.remove()
            }, this.options.parseTime ? this.data.length === 1 && this.options.xLabels === "auto" ? r = [
                [this.data[0].label, this.data[0].x]
            ] : r = t.labelSeries(this.xmin, this.xmax, this.width, this.options.xLabels, this.options.xLabelFormat) : r = function () {
                var e, t, n, r;
                n = this.data, r = [];
                for (e = 0, t = n.length; e < t; e++)s = n[e], r.push([s.label, s.x]);
                return r
            }.call(this), r.reverse(), l = [];
            for (a = 0, f = r.length; a < f; a++)n = r[a], l.push(e(n[0], n[1]));
            return l
        }, r.prototype.drawSeries = function () {
            var e, t, n, r, i, s, o, u, a;
            for (t = i = o = this.options.ykeys.length - 1; o <= 0 ? i <= 0 : i >= 0; t = o <= 0 ? ++i : --i)n = this.paths[t], n !== null && this.r.path(n).attr("stroke", this.colorForSeries(t)).attr("stroke-width", this.options.lineWidth);
            this.seriesPoints = function () {
                var e, n, r;
                r = [];
                for (t = e = 0, n = this.options.ykeys.length; 0 <= n ? e < n : e > n; t = 0 <= n ? ++e : --e)r.push([]);
                return r
            }.call(this), a = [];
            for (t = s = u = this.options.ykeys.length - 1; u <= 0 ? s <= 0 : s >= 0; t = u <= 0 ? ++s : --s)a.push(function () {
                var n, i, s, o;
                s = this.data, o = [];
                for (n = 0, i = s.length; n < i; n++)r = s[n], r._y[t] === null ? e = null : e = this.r.circle(r._x, r._y[t], this.options.pointSize).attr("fill", this.pointFillColorForSeries(t) || this.colorForSeries(t)).attr("stroke-width", this.strokeWidthForSeries(t)).attr("stroke", this.strokeForSeries(t)), o.push(this.seriesPoints[t].push(e));
                return o
            }.call(this));
            return a
        }, r.prototype.createPath = function (t, n) {
            var r, i, s, o, u, a, f, l, c, h, p, d, v, m;
            l = "";
            if (n) {
                s = this.gradients(t);
                for (o = v = 0, m = t.length - 1; 0 <= m ? v <= m : v >= m; o = 0 <= m ? ++v : --v)r = t[o], o === 0 ? l += "M" + r.x + "," + r.y : (i = s[o], a = t[o - 1], f = s[o - 1], u = (r.x - a.x) / 4, c = a.x + u, p = Math.min(this.bottom, a.y + u * f), h = r.x - u, d = Math.min(this.bottom, r.y - u * i), l += "C" + c + "," + p + "," + h + "," + d + "," + r.x + "," + r.y)
            } else l = "M" + e.map(t,function (e) {
                return"" + e.x + "," + e.y
            }).join("L");
            return l
        }, r.prototype.gradients = function (t) {
            return e.map(t, function (e, n) {
                return n === 0 ? (t[1].y - e.y) / (t[1].x - e.x) : n === t.length - 1 ? (e.y - t[n - 1].y) / (e.x - t[n - 1].x) : (t[n + 1].y - t[n - 1].y) / (t[n + 1].x - t[n - 1].x)
            })
        }, r.prototype.drawHover = function () {
            var e, t, n, r, i, s;
            this.hoverHeight = this.options.hoverFontSize * 1.5 * (this.options.ykeys.length + 1), this.hover = this.r.rect(-10, -this.hoverHeight / 2 - this.options.hoverPaddingY, 20, this.hoverHeight + this.options.hoverPaddingY * 2, 10).attr("fill", this.options.hoverFillColor).attr("stroke", this.options.hoverBorderColor).attr("stroke-width", this.options.hoverBorderWidth).attr("opacity", this.options.hoverOpacity), this.xLabel = this.r.text(0, this.options.hoverFontSize * .75 - this.hoverHeight / 2, "").attr("fill", this.options.hoverLabelColor).attr("font-weight", "bold").attr("font-size", this.options.hoverFontSize), this.hoverSet = this.r.set(), this.hoverSet.push(this.hover), this.hoverSet.push(this.xLabel), this.yLabels = [], s = [];
            for (e = r = 0, i = this.options.ykeys.length; 0 <= i ? r < i : r > i; e = 0 <= i ? ++r : --r)t = this.cumulative ? this.options.ykeys.length - e - 1 : e, n = this.r.text(0, this.options.hoverFontSize * 1.5 * (t + 1.5) - this.hoverHeight / 2, "").attr("fill", this.colorForSeries(e)).attr("font-size", this.options.hoverFontSize), this.yLabels.push(n), s.push(this.hoverSet.push(n));
            return s
        }, r.prototype.updateHover = function (t) {
            var n, r, i, s, o, u, a, f, l;
            this.hoverSet.show(), i = this.data[t], this.xLabel.attr("text", i.label), l = i.y;
            for (n = a = 0, f = l.length; a < f; n = ++a)o = l[n], this.yLabels[n].attr("text", "" + this.options.labels[n] + ": " + this.yLabelFormat(o));
            return r = Math.max.apply(null, e.map(this.yLabels, function (e) {
                return e.getBBox().width
            })), r = Math.max(r, this.xLabel.getBBox().width), this.hover.attr("width", r + this.options.hoverPaddingX * 2), this.hover.attr("x", -this.options.hoverPaddingX - r / 2), u = Math.min.apply(null, function () {
                var e, t, n, r;
                n = i._y, r = [];
                for (e = 0, t = n.length; e < t; e++)o = n[e], o !== null && r.push(o);
                return r
            }().concat(this.bottom)), u > this.hoverHeight + this.options.hoverPaddingY * 2 + this.options.hoverMargin + this.top ? u = u - this.hoverHeight / 2 - this.options.hoverPaddingY - this.options.hoverMargin : u = u + this.hoverHeight / 2 + this.options.hoverPaddingY + this.options.hoverMargin, u = Math.max(this.top + this.hoverHeight / 2 + this.options.hoverPaddingY, u), u = Math.min(this.bottom - this.hoverHeight / 2 - this.options.hoverPaddingY, u), s = Math.min(this.right - r / 2 - this.options.hoverPaddingX, this.data[t]._x), s = Math.max(this.left + r / 2 + this.options.hoverPaddingX, s), this.hoverSet.attr("transform", "t" + s + "," + u)
        }, r.prototype.hideHover = function () {
            return this.hoverSet.hide()
        }, r.prototype.hilight = function (e) {
            var t, n, r, i, s;
            if (this.prevHilight !== null && this.prevHilight !== e)for (t = n = 0, i = this.seriesPoints.length - 1; 0 <= i ? n <= i : n >= i; t = 0 <= i ? ++n : --n)this.seriesPoints[t][this.prevHilight] && this.seriesPoints[t][this.prevHilight].animate(this.pointShrink);
            if (e !== null && this.prevHilight !== e) {
                for (t = r = 0, s = this.seriesPoints.length - 1; 0 <= s ? r <= s : r >= s; t = 0 <= s ? ++r : --r)this.seriesPoints[t][e] && this.seriesPoints[t][e].animate(this.pointGrow);
                this.updateHover(e)
            }
            this.prevHilight = e;
            if (e === null)return this.hideHover()
        }, r.prototype.updateHilight = function (e) {
            var t, n, r;
            e -= this.el.offset().left;
            for (t = n = 0, r = this.hoverMargins.length; 0 <= r ? n < r : n > r; t = 0 <= r ? ++n : --n)if (this.hoverMargins[t] > e)break;
            return this.hilight(t)
        }, r.prototype.colorForSeries = function (e) {
            return this.options.lineColors[e % this.options.lineColors.length]
        }, r.prototype.strokeWidthForSeries = function (e) {
            return this.options.pointWidths[e % this.options.pointWidths.length]
        }, r.prototype.strokeForSeries = function (e) {
            return this.options.pointStrokeColors[e % this.options.pointStrokeColors.length]
        }, r.prototype.pointFillColorForSeries = function (e) {
            return this.options.pointFillColors[e % this.options.pointFillColors.length]
        }, r
    }(t.Grid), t.labelSeries = function (n, r, i, s, o) {
        var u, a, f, l, c, h, p, d, v, m, g;
        f = 200 * (r - n) / i, a = new Date(n), p = t.LABEL_SPECS[s];
        if (p === void 0) {
            g = t.AUTO_LABEL_ORDER;
            for (v = 0, m = g.length; v < m; v++) {
                l = g[v], h = t.LABEL_SPECS[l];
                if (f >= h.span) {
                    p = h;
                    break
                }
            }
        }
        p === void 0 && (p = t.LABEL_SPECS.second), o && (p = e.extend({}, p, {fmt: o})), u = p.start(a), c = [];
        while ((d = u.getTime()) <= r)d >= n && c.push([p.fmt(u), d]), p.incr(u);
        return c
    }, n = function (e) {
        return{span: e * 60 * 1e3, start: function (e) {
            return new Date(e.getFullYear(), e.getMonth(), e.getDate(), e.getHours())
        }, fmt: function (e) {
            return"" + t.pad2(e.getHours()) + ":" + t.pad2(e.getMinutes())
        }, incr: function (t) {
            return t.setMinutes(t.getMinutes() + e)
        }}
    }, r = function (e) {
        return{span: e * 1e3, start: function (e) {
            return new Date(e.getFullYear(), e.getMonth(), e.getDate(), e.getHours(), e.getMinutes())
        }, fmt: function (e) {
            return"" + t.pad2(e.getHours()) + ":" + t.pad2(e.getMinutes()) + ":" + t.pad2(e.getSeconds())
        }, incr: function (t) {
            return t.setSeconds(t.getSeconds() + e)
        }}
    }, t.LABEL_SPECS = {year: {span: 1728e7, start: function (e) {
        return new Date(e.getFullYear(), 0, 1)
    }, fmt: function (e) {
        return"" + e.getFullYear()
    }, incr: function (e) {
        return e.setFullYear(e.getFullYear() + 1)
    }}, month: {span: 24192e5, start: function (e) {
        return new Date(e.getFullYear(), e.getMonth(), 1)
    }, fmt: function (e) {
        return"" + e.getFullYear() + "-" + t.pad2(e.getMonth() + 1)
    }, incr: function (e) {
        return e.setMonth(e.getMonth() + 1)
    }}, day: {span: 864e5, start: function (e) {
        return new Date(e.getFullYear(), e.getMonth(), e.getDate())
    }, fmt: function (e) {
        return"" + e.getFullYear() + "-" + t.pad2(e.getMonth() + 1) + "-" + t.pad2(e.getDate())
    }, incr: function (e) {
        return e.setDate(e.getDate() + 1)
    }}, hour: n(60), "30min": n(30), "15min": n(15), "10min": n(10), "5min": n(5), minute: n(1), "30sec": r(30), "15sec": r(15), "10sec": r(10), "5sec": r(5), second: r(1)}, t.AUTO_LABEL_ORDER = ["year", "month", "day", "hour", "30min", "15min", "10min", "5min", "minute", "30sec", "15sec", "10sec", "5sec", "second"], t.Area = function (e) {
        function n(e) {
            if (!(this instanceof t.Area))return new t.Area(e);
            this.cumulative = !0, n.__super__.constructor.call(this, e)
        }

        return o(n, e), n.prototype.calcPoints = function () {
            var e, t, n, r, i, s, o;
            s = this.data, o = [];
            for (r = 0, i = s.length; r < i; r++)e = s[r], e._x = this.transX(e.x), t = 0, o.push(e._y = function () {
                var r, i, s, o;
                s = e.y, o = [];
                for (r = 0, i = s.length; r < i; r++)n = s[r], t += n || 0, o.push(this.transY(t));
                return o
            }.call(this));
            return o
        }, n.prototype.drawSeries = function () {
            var e, t, r, i;
            for (e = r = i = this.options.ykeys.length - 1; i <= 0 ? r <= 0 : r >= 0; e = i <= 0 ? ++r : --r)t = this.paths[e], t !== null && (t += "L" + this.transX(this.xmax) + "," + this.bottom + "L" + this.transX(this.xmin) + "," + this.bottom + "Z", this.r.path(t).attr("fill", this.fillForSeries(e)).attr("stroke-width", 0));
            return n.__super__.drawSeries.call(this)
        }, n.prototype.fillForSeries = function (e) {
            var t;
            return t = Raphael.rgb2hsl(this.colorForSeries(e)), Raphael.hsl(t.h, Math.min(255, t.s * .75), Math.min(255, t.l * 1.25))
        }, n
    }(t.Line), t.Bar = function (n) {
        function r(n) {
            this.updateHilight = u(this.updateHilight, this), this.hilight = u(this.hilight, this), this.updateHover = u(this.updateHover, this);
            if (!(this instanceof t.Bar))return new t.Bar(n);
            r.__super__.constructor.call(this, e.extend({}, n, {parseTime: !1}))
        }

        return o(r, n), r.prototype.init = function () {
            var e, t = this;
            return this.prevHilight = null, this.el.mousemove(function (e) {
                return t.updateHilight(e.pageX)
            }), this.options.hideHover && this.el.mouseout(function (e) {
                return t.hilight(null)
            }), e = function (e) {
                var n;
                return n = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0], t.updateHilight(n.pageX), n
            }, this.el.bind("touchstart", e), this.el.bind("touchmove", e), this.el.bind("touchend", e)
        }, r.prototype.defaults = {barSizeRatio: .75, barGap: 3, barColors: ["#0b62a4", "#7a92a3", "#4da74d", "#afd8f8", "#edc240", "#cb4b4b", "#9440ed"], hoverPaddingX: 10, hoverPaddingY: 5, hoverMargin: 10, hoverFillColor: "#fff", hoverBorderColor: "#ccc", hoverBorderWidth: 2, hoverOpacity: .95, hoverLabelColor: "#444", hoverFontSize: 12, hideHover: !1}, r.prototype.calc = function () {
            return this.calcBars(), this.calcHoverMargins()
        }, r.prototype.calcBars = function () {
            var e, t, n, r, i, s, o;
            s = this.data, o = [];
            for (e = r = 0, i = s.length; r < i; e = ++r)t = s[e], t._x = this.left + this.width * (e + .5) / this.data.length, o.push(t._y = function () {
                var e, r, i, s;
                i = t.y, s = [];
                for (e = 0, r = i.length; e < r; e++)n = i[e], n === null ? s.push(null) : s.push(this.transY(n));
                return s
            }.call(this));
            return o
        }, r.prototype.calcHoverMargins = function () {
            var e;
            return this.hoverMargins = function () {
                var t, n, r;
                r = [];
                for (e = t = 1, n = this.data.length; 1 <= n ? t < n : t > n; e = 1 <= n ? ++t : --t)r.push(this.left + e * this.width / this.data.length);
                return r
            }.call(this)
        }, r.prototype.draw = function () {
            return this.drawXAxis(), this.drawSeries(), this.drawHover(), this.hilight(this.options.hideHover ? null : this.data.length - 1)
        }, r.prototype.drawXAxis = function () {
            var e, t, n, r, i, s, o, u, a, f;
            o = this.bottom + this.options.gridTextSize * 1.25, s = 50, r = null, f = [];
            for (e = u = 0, a = this.data.length; 0 <= a ? u < a : u > a; e = 0 <= a ? ++u : --u)i = this.data[this.data.length - 1 - e], t = this.r.text(i._x, o, i.label).attr("font-size", this.options.gridTextSize).attr("fill", this.options.gridTextColor), n = t.getBBox(), (r === null || r >= n.x + n.width) && n.x >= 0 && n.x + n.width < this.el.width() ? f.push(r = n.x - s) : f.push(t.remove());
            return f
        }, r.prototype.drawSeries = function () {
            var e, t, n, r, i, s, o, u, a, f, l, c;
            return n = this.width / this.options.data.length, o = this.options.ykeys.length, e = (n * this.options.barSizeRatio - this.options.barGap * (o - 1)) / o, s = n * (1 - this.options.barSizeRatio) / 2, c = this.ymin <= 0 && this.ymax >= 0 ? this.transY(0) : null, this.bars = function () {
                var o, h, p, d;
                p = this.data, d = [];
                for (r = o = 0, h = p.length; o < h; r = ++o)u = p[r], d.push(function () {
                    var o, h, p, d;
                    p = u._y, d = [];
                    for (a = o = 0, h = p.length; o < h; a = ++o)l = p[a], l !== null ? (c ? (f = Math.min(l, c), t = Math.max(l, c)) : (f = l, t = this.bottom), i = this.left + r * n + s + a * (e + this.options.barGap), d.push(this.r.rect(i, f, e, t - f).attr("fill", this.options.barColors[a % this.options.barColors.length]).attr("stroke-width", 0))) : d.push(null);
                    return d
                }.call(this));
                return d
            }.call(this)
        }, r.prototype.drawHover = function () {
            var e, t, n, r, i;
            this.hoverHeight = this.options.hoverFontSize * 1.5 * (this.options.ykeys.length + 1), this.hover = this.r.rect(-10, -this.hoverHeight / 2 - this.options.hoverPaddingY, 20, this.hoverHeight + this.options.hoverPaddingY * 2, 10).attr("fill", this.options.hoverFillColor).attr("stroke", this.options.hoverBorderColor).attr("stroke-width", this.options.hoverBorderWidth).attr("opacity", this.options.hoverOpacity), this.xLabel = this.r.text(0, this.options.hoverFontSize * .75 - this.hoverHeight / 2, "").attr("fill", this.options.hoverLabelColor).attr("font-weight", "bold").attr("font-size", this.options.hoverFontSize), this.hoverSet = this.r.set(), this.hoverSet.push(this.hover), this.hoverSet.push(this.xLabel), this.yLabels = [], i = [];
            for (e = n = 0, r = this.options.ykeys.length; 0 <= r ? n < r : n > r; e = 0 <= r ? ++n : --n)t = this.r.text(0, this.options.hoverFontSize * 1.5 * (e + 1.5) - this.hoverHeight / 2, "").attr("font-size", this.options.hoverFontSize), this.yLabels.push(t), i.push(this.hoverSet.push(t));
            return i
        }, r.prototype.updateHover = function (t) {
            var n, r, i, s, o, u, a, f, l;
            this.hoverSet.show(), i = this.data[t], this.xLabel.attr("text", i.label), l = i.y;
            for (n = a = 0, f = l.length; a < f; n = ++a)o = l[n], this.yLabels[n].attr("fill", this.options.barColors[n % this.options.barColors.length]), this.yLabels[n].attr("text", "" + this.options.labels[n] + ": " + this.yLabelFormat(o));
            return r = Math.max.apply(null, e.map(this.yLabels, function (e) {
                return e.getBBox().width
            })), r = Math.max(r, this.xLabel.getBBox().width), this.hover.attr("width", r + this.options.hoverPaddingX * 2), this.hover.attr("x", -this.options.hoverPaddingX - r / 2), u = (this.bottom + this.top) / 2, s = Math.min(this.right - r / 2 - this.options.hoverPaddingX, this.data[t]._x), s = Math.max(this.left + r / 2 + this.options.hoverPaddingX, s), this.hoverSet.attr("transform", "t" + s + "," + u)
        }, r.prototype.hideHover = function () {
            return this.hoverSet.hide()
        }, r.prototype.hilight = function (e) {
            e !== null && this.prevHilight !== e && this.updateHover(e), this.prevHilight = e;
            if (e === null)return this.hideHover()
        }, r.prototype.updateHilight = function (e) {
            var t, n, r;
            e -= this.el.offset().left;
            for (t = n = 0, r = this.hoverMargins.length; 0 <= r ? n < r : n > r; t = 0 <= r ? ++n : --n)if (this.hoverMargins[t] > e)break;
            return this.hilight(t)
        }, r
    }(t.Grid), t.Donut = function () {
        function n(n) {
            this.select = u(this.select, this);
            if (!(this instanceof t.Donut))return new t.Donut(n);
            typeof n.element == "string" ? this.el = e(document.getElementById(n.element)) : this.el = e(n.element), this.options = e.extend({}, this.defaults, n);
            if (this.el === null || this.el.length === 0)throw new Error("Graph placeholder not found.");
            if (n.data === void 0 || n.data.length === 0)return;
            this.data = n.data, this.el.addClass("graph-initialised"), this.redraw()
        }

        return n.prototype.defaults = {colors: ["#0B62A4", "#3980B5", "#679DC6", "#95BBD7", "#B0CCE1", "#095791", "#095085", "#083E67", "#052C48", "#042135"], formatter: t.commas}, n.prototype.redraw = function () {
            var e, n, r, i, s, o, u, a, f, l, c, h, p, d, v, m, g, y, b, w, E, S, x;
            this.el.empty(), this.r = new Raphael(this.el[0]), n = this.el.width() / 2, r = this.el.height() / 2, h = (Math.min(n, r) - 10) / 3, c = 0, w = this.data;
            for (d = 0, g = w.length; d < g; d++)p = w[d], c += p.value;
            a = 5 / (2 * h), e = 1.9999 * Math.PI - a * this.data.length, o = 0, s = 0, this.segments = [], E = this.data;
            for (v = 0, y = E.length; v < y; v++)i = E[v], f = o + a + e * (i.value / c), l = new t.DonutSegment(n, r, h * 2, h, o, f, this.options.colors[s % this.options.colors.length], i), l.render(this.r), this.segments.push(l), l.on("hover", this.select), o = f, s += 1;
            this.text1 = this.r.text(n, r - 10, "").attr({"font-size": 15, "font-weight": 800}), this.text2 = this.r.text(n, r + 10, "").attr({"font-size": 14}), u = Math.max.apply(null, function () {
                var e, t, n, r;
                n = this.data, r = [];
                for (e = 0, t = n.length; e < t; e++)i = n[e], r.push(i.value);
                return r
            }.call(this)), s = 0, S = this.data, x = [];
            for (m = 0, b = S.length; m < b; m++) {
                i = S[m];
                if (i.value === u) {
                    this.select(s);
                    break
                }
                x.push(s += 1)
            }
            return x
        }, n.prototype.select = function (e) {
            var t, n, r, i, s;
            s = this.segments;
            for (r = 0, i = s.length; r < i; r++)t = s[r], t.deselect();
            return typeof e == "number" ? n = this.segments[e] : n = e, n.select(), this.setLabels(n.data.label, this.options.formatter(n.data.value))
        }, n.prototype.setLabels = function (e, t) {
            var n, r, i, s, o, u, a, f;
            return n = (Math.min(this.el.width() / 2, this.el.height() / 2) - 10) * 2 / 3, s = 1.8 * n, i = n / 2, r = n / 3, this.text1.attr({text: e, transform: ""}), o = this.text1.getBBox(), u = Math.min(s / o.width, i / o.height), this.text1.attr({transform: "S" + u + "," + u + "," + (o.x + o.width / 2) + "," + (o.y + o.height)}), this.text2.attr({text: t, transform: ""}), a = this.text2.getBBox(), f = Math.min(s / a.width, r / a.height), this.text2.attr({transform: "S" + f + "," + f + "," + (a.x + a.width / 2) + "," + a.y})
        }, n
    }(), t.DonutSegment = function (e) {
        function t(e, t, n, r, i, s, o, a) {
            this.cx = e, this.cy = t, this.inner = n, this.outer = r, this.color = o, this.data = a, this.deselect = u(this.deselect, this), this.select = u(this.select, this), this.sin_p0 = Math.sin(i), this.cos_p0 = Math.cos(i), this.sin_p1 = Math.sin(s), this.cos_p1 = Math.cos(s), this.long = s - i > Math.PI ? 1 : 0, this.path = this.calcSegment(this.inner + 3, this.inner + this.outer - 5), this.selectedPath = this.calcSegment(this.inner + 3, this.inner + this.outer), this.hilight = this.calcArc(this.inner)
        }

        return o(t, e), t.prototype.calcArcPoints = function (e) {
            return[this.cx + e * this.sin_p0, this.cy + e * this.cos_p0, this.cx + e * this.sin_p1, this.cy + e * this.cos_p1]
        }, t.prototype.calcSegment = function (e, t) {
            var n, r, i, s, o, u, a, f, l, c;
            return l = this.calcArcPoints(e), n = l[0], i = l[1], r = l[2], s = l[3], c = this.calcArcPoints(t), o = c[0], a = c[1], u = c[2], f = c[3], "M" + n + "," + i + ("A" + e + "," + e + ",0," + this.long + ",0," + r + "," + s) + ("L" + u + "," + f) + ("A" + t + "," + t + ",0," + this.long + ",1," + o + "," + a) + "Z"
        }, t.prototype.calcArc = function (e) {
            var t, n, r, i, s;
            return s = this.calcArcPoints(e), t = s[0], r = s[1], n = s[2], i = s[3], "M" + t + "," + r + ("A" + e + "," + e + ",0," + this.long + ",0," + n + "," + i)
        }, t.prototype.render = function (e) {
            var t = this;
            return this.arc = e.path(this.hilight).attr({stroke: this.color, "stroke-width": 2, opacity: 0}), this.seg = e.path(this.path).attr({fill: this.color, stroke: "white", "stroke-width": 3}).hover(function () {
                return t.fire("hover", t)
            })
        }, t.prototype.select = function () {
            if (!this.selected)return this.seg.animate({path: this.selectedPath}, 150, "<>"), this.arc.animate({opacity: 1}, 150, "<>"), this.selected = !0
        }, t.prototype.deselect = function () {
            if (this.selected)return this.seg.animate({path: this.path}, 150, "<>"), this.arc.animate({opacity: 0}, 150, "<>"), this.selected = !1
        }, t
    }(t.EventEmitter)
}).call(this);
;// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Raphaël 2.1.0 - JavaScript Vector Library                          │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2008-2012 Dmitry Baranovskiy (http://raphaeljs.com)    │ \\
// │ Copyright © 2008-2012 Sencha Labs (http://sencha.com)              │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Licensed under the MIT (http://raphaeljs.com/license.html) license.│ \\
// └────────────────────────────────────────────────────────────────────┘ \\
(function (n) {
    var e, t, r = "0.4.2", f = "hasOwnProperty", i = /[\.\/]/, o = "*", u = function () {
    }, l = function (n, e) {
        return n - e
    }, s = {n: {}}, p = function (n, r) {
        n += "";
        var f, i = t, o = Array.prototype.slice.call(arguments, 2), u = p.listeners(n), s = 0, a = [], c = {}, h = [], d = e;
        e = n, t = 0;
        for (var g = 0, v = u.length; v > g; g++)"zIndex"in u[g] && (a.push(u[g].zIndex), 0 > u[g].zIndex && (c[u[g].zIndex] = u[g]));
        for (a.sort(l); 0 > a[s];)if (f = c[a[s++]], h.push(f.apply(r, o)), t)return t = i, h;
        for (g = 0; v > g; g++)if (f = u[g], "zIndex"in f)if (f.zIndex == a[s]) {
            if (h.push(f.apply(r, o)), t)break;
            do if (s++, f = c[a[s]], f && h.push(f.apply(r, o)), t)break; while (f)
        } else c[f.zIndex] = f; else if (h.push(f.apply(r, o)), t)break;
        return t = i, e = d, h.length ? h : null
    };
    p._events = s, p.listeners = function (n) {
        var e, t, r, f, u, l, p, a, c = n.split(i), h = s, d = [h], g = [];
        for (f = 0, u = c.length; u > f; f++) {
            for (a = [], l = 0, p = d.length; p > l; l++)for (h = d[l].n, t = [h[c[f]], h[o]], r = 2; r--;)e = t[r], e && (a.push(e), g = g.concat(e.f || []));
            d = a
        }
        return g
    }, p.on = function (n, e) {
        if (n += "", "function" != typeof e)return function () {
        };
        for (var t = n.split(i), r = s, f = 0, o = t.length; o > f; f++)r = r.n, r = r.hasOwnProperty(t[f]) && r[t[f]] || (r[t[f]] = {n: {}});
        for (r.f = r.f || [], f = 0, o = r.f.length; o > f; f++)if (r.f[f] == e)return u;
        return r.f.push(e), function (n) {
            +n == +n && (e.zIndex = +n)
        }
    }, p.f = function (n) {
        var e = [].slice.call(arguments, 1);
        return function () {
            p.apply(null, [n, null].concat(e).concat([].slice.call(arguments, 0)))
        }
    }, p.stop = function () {
        t = 1
    }, p.nt = function (n) {
        return n ? RegExp("(?:\\.|\\/|^)" + n + "(?:\\.|\\/|$)").test(e) : e
    }, p.nts = function () {
        return e.split(i)
    }, p.off = p.unbind = function (n, e) {
        if (!n)return p._events = s = {n: {}}, void 0;
        var t, r, u, l, a, c, h, d = n.split(i), g = [s];
        for (l = 0, a = d.length; a > l; l++)for (c = 0; g.length > c; c += u.length - 2) {
            if (u = [c, 1], t = g[c].n, d[l] != o)t[d[l]] && u.push(t[d[l]]); else for (r in t)t[f](r) && u.push(t[r]);
            g.splice.apply(g, u)
        }
        for (l = 0, a = g.length; a > l; l++)for (t = g[l]; t.n;) {
            if (e) {
                if (t.f) {
                    for (c = 0, h = t.f.length; h > c; c++)if (t.f[c] == e) {
                        t.f.splice(c, 1);
                        break
                    }
                    !t.f.length && delete t.f
                }
                for (r in t.n)if (t.n[f](r) && t.n[r].f) {
                    var v = t.n[r].f;
                    for (c = 0, h = v.length; h > c; c++)if (v[c] == e) {
                        v.splice(c, 1);
                        break
                    }
                    !v.length && delete t.n[r].f
                }
            } else {
                delete t.f;
                for (r in t.n)t.n[f](r) && t.n[r].f && delete t.n[r].f
            }
            t = t.n
        }
    }, p.once = function (n, e) {
        var t = function () {
            return p.unbind(n, t), e.apply(this, arguments)
        };
        return p.on(n, t)
    }, p.version = r, p.toString = function () {
        return"You are running Eve " + r
    }, "undefined" != typeof module && module.exports ? module.exports = p : "undefined" != typeof define ? define("eve", [], function () {
        return p
    }) : n.eve = p
})(this);
(function () {
    function t(e) {
        if (t.is(e, "function"))return m ? e() : eve.on("raphael.DOMload", e);
        if (t.is(e, N))return t._engine.create[F](t, e.splice(0, 3 + t.is(e[0], Y))).add(e);
        var n = Array.prototype.slice.call(arguments, 0);
        if (t.is(n[n.length - 1], "function")) {
            var r = n.pop();
            return m ? r.call(t._engine.create[F](t, n)) : eve.on("raphael.DOMload", function () {
                r.call(t._engine.create[F](t, n))
            })
        }
        return t._engine.create[F](t, arguments)
    }

    function e(t) {
        if (Object(t) !== t)return t;
        var n = new t.constructor;
        for (var r in t)t[k](r) && (n[r] = e(t[r]));
        return n
    }

    function n(t, e) {
        for (var n = 0, r = t.length; r > n; n++)if (t[n] === e)return t.push(t.splice(n, 1)[0])
    }

    function r(t, e, r) {
        function i() {
            var a = Array.prototype.slice.call(arguments, 0), s = a.join("␀"), o = i.cache = i.cache || {}, u = i.count = i.count || [];
            return o[k](s) ? (n(u, s), r ? r(o[s]) : o[s]) : (u.length >= 1e3 && delete o[u.shift()], u.push(s), o[s] = t[F](e, a), r ? r(o[s]) : o[s])
        }

        return i
    }

    function i() {
        return this.hex
    }

    function a(t, e) {
        for (var n = [], r = 0, i = t.length; i - 2 * !e > r; r += 2) {
            var a = [
                {x: +t[r - 2], y: +t[r - 1]},
                {x: +t[r], y: +t[r + 1]},
                {x: +t[r + 2], y: +t[r + 3]},
                {x: +t[r + 4], y: +t[r + 5]}
            ];
            e ? r ? i - 4 == r ? a[3] = {x: +t[0], y: +t[1]} : i - 2 == r && (a[2] = {x: +t[0], y: +t[1]}, a[3] = {x: +t[2], y: +t[3]}) : a[0] = {x: +t[i - 2], y: +t[i - 1]} : i - 4 == r ? a[3] = a[2] : r || (a[0] = {x: +t[r], y: +t[r + 1]}), n.push(["C", (-a[0].x + 6 * a[1].x + a[2].x) / 6, (-a[0].y + 6 * a[1].y + a[2].y) / 6, (a[1].x + 6 * a[2].x - a[3].x) / 6, (a[1].y + 6 * a[2].y - a[3].y) / 6, a[2].x, a[2].y])
        }
        return n
    }

    function s(t, e, n, r, i) {
        var a = -3 * e + 9 * n - 9 * r + 3 * i, s = t * a + 6 * e - 12 * n + 6 * r;
        return t * s - 3 * e + 3 * n
    }

    function o(t, e, n, r, i, a, o, u, l) {
        null == l && (l = 1), l = l > 1 ? 1 : 0 > l ? 0 : l;
        for (var h = l / 2, c = 12, f = [-.1252, .1252, -.3678, .3678, -.5873, .5873, -.7699, .7699, -.9041, .9041, -.9816, .9816], p = [.2491, .2491, .2335, .2335, .2032, .2032, .1601, .1601, .1069, .1069, .0472, .0472], d = 0, g = 0; c > g; g++) {
            var x = h * f[g] + h, v = s(x, t, n, i, o), m = s(x, e, r, a, u), y = v * v + m * m;
            d += p[g] * j.sqrt(y)
        }
        return h * d
    }

    function u(t, e, n, r, i, a, s, u, l) {
        if (!(0 > l || l > o(t, e, n, r, i, a, s, u))) {
            var h, c = 1, f = c / 2, p = c - f, d = .01;
            for (h = o(t, e, n, r, i, a, s, u, p); O(h - l) > d;)f /= 2, p += (l > h ? 1 : -1) * f, h = o(t, e, n, r, i, a, s, u, p);
            return p
        }
    }

    function l(t, e, n, r, i, a, s, o) {
        if (!(D(t, n) < z(i, s) || z(t, n) > D(i, s) || D(e, r) < z(a, o) || z(e, r) > D(a, o))) {
            var u = (t * r - e * n) * (i - s) - (t - n) * (i * o - a * s), l = (t * r - e * n) * (a - o) - (e - r) * (i * o - a * s), h = (t - n) * (a - o) - (e - r) * (i - s);
            if (h) {
                var c = u / h, f = l / h, p = +c.toFixed(2), d = +f.toFixed(2);
                if (!(+z(t, n).toFixed(2) > p || p > +D(t, n).toFixed(2) || +z(i, s).toFixed(2) > p || p > +D(i, s).toFixed(2) || +z(e, r).toFixed(2) > d || d > +D(e, r).toFixed(2) || +z(a, o).toFixed(2) > d || d > +D(a, o).toFixed(2)))return{x: c, y: f}
            }
        }
    }

    function h(e, n, r) {
        var i = t.bezierBBox(e), a = t.bezierBBox(n);
        if (!t.isBBoxIntersect(i, a))return r ? 0 : [];
        for (var s = o.apply(0, e), u = o.apply(0, n), h = ~~(s / 5), c = ~~(u / 5), f = [], p = [], d = {}, g = r ? 0 : [], x = 0; h + 1 > x; x++) {
            var v = t.findDotsAtSegment.apply(t, e.concat(x / h));
            f.push({x: v.x, y: v.y, t: x / h})
        }
        for (x = 0; c + 1 > x; x++)v = t.findDotsAtSegment.apply(t, n.concat(x / c)), p.push({x: v.x, y: v.y, t: x / c});
        for (x = 0; h > x; x++)for (var m = 0; c > m; m++) {
            var y = f[x], b = f[x + 1], _ = p[m], w = p[m + 1], k = .001 > O(b.x - y.x) ? "y" : "x", B = .001 > O(w.x - _.x) ? "y" : "x", S = l(y.x, y.y, b.x, b.y, _.x, _.y, w.x, w.y);
            if (S) {
                if (d[S.x.toFixed(4)] == S.y.toFixed(4))continue;
                d[S.x.toFixed(4)] = S.y.toFixed(4);
                var C = y.t + O((S[k] - y[k]) / (b[k] - y[k])) * (b.t - y.t), F = _.t + O((S[B] - _[B]) / (w[B] - _[B])) * (w.t - _.t);
                C >= 0 && 1 >= C && F >= 0 && 1 >= F && (r ? g++ : g.push({x: S.x, y: S.y, t1: C, t2: F}))
            }
        }
        return g
    }

    function c(e, n, r) {
        e = t._path2curve(e), n = t._path2curve(n);
        for (var i, a, s, o, u, l, c, f, p, d, g = r ? 0 : [], x = 0, v = e.length; v > x; x++) {
            var m = e[x];
            if ("M" == m[0])i = u = m[1], a = l = m[2]; else {
                "C" == m[0] ? (p = [i, a].concat(m.slice(1)), i = p[6], a = p[7]) : (p = [i, a, i, a, u, l, u, l], i = u, a = l);
                for (var y = 0, b = n.length; b > y; y++) {
                    var _ = n[y];
                    if ("M" == _[0])s = c = _[1], o = f = _[2]; else {
                        "C" == _[0] ? (d = [s, o].concat(_.slice(1)), s = d[6], o = d[7]) : (d = [s, o, s, o, c, f, c, f], s = c, o = f);
                        var w = h(p, d, r);
                        if (r)g += w; else {
                            for (var k = 0, B = w.length; B > k; k++)w[k].segment1 = x, w[k].segment2 = y, w[k].bez1 = p, w[k].bez2 = d;
                            g = g.concat(w)
                        }
                    }
                }
            }
        }
        return g
    }

    function f(t, e, n, r, i, a) {
        null != t ? (this.a = +t, this.b = +e, this.c = +n, this.d = +r, this.e = +i, this.f = +a) : (this.a = 1, this.b = 0, this.c = 0, this.d = 1, this.e = 0, this.f = 0)
    }

    function p() {
        return this.x + P + this.y + P + this.width + " × " + this.height
    }

    function d(t, e, n, r, i, a) {
        function s(t) {
            return((c * t + h) * t + l) * t
        }

        function o(t, e) {
            var n = u(t, e);
            return((d * n + p) * n + f) * n
        }

        function u(t, e) {
            var n, r, i, a, o, u;
            for (i = t, u = 0; 8 > u; u++) {
                if (a = s(i) - t, e > O(a))return i;
                if (o = (3 * c * i + 2 * h) * i + l, 1e-6 > O(o))break;
                i -= a / o
            }
            if (n = 0, r = 1, i = t, n > i)return n;
            if (i > r)return r;
            for (; r > n;) {
                if (a = s(i), e > O(a - t))return i;
                t > a ? n = i : r = i, i = (r - n) / 2 + n
            }
            return i
        }

        var l = 3 * e, h = 3 * (r - e) - l, c = 1 - l - h, f = 3 * n, p = 3 * (i - n) - f, d = 1 - f - p;
        return o(t, 1 / (200 * a))
    }

    function g(t, e) {
        var n = [], r = {};
        if (this.ms = e, this.times = 1, t) {
            for (var i in t)t[k](i) && (r[Q(i)] = t[i], n.push(Q(i)));
            n.sort(le)
        }
        this.anim = r, this.top = n[n.length - 1], this.percents = n
    }

    function x(e, n, r, i, a, s) {
        r = Q(r);
        var o, u, l, h, c, p, g = e.ms, x = {}, v = {}, m = {};
        if (i)for (_ = 0, w = sn.length; w > _; _++) {
            var y = sn[_];
            if (y.el.id == n.id && y.anim == e) {
                y.percent != r ? (sn.splice(_, 1), l = 1) : u = y, n.attr(y.totalOrigin);
                break
            }
        } else i = +v;
        for (var _ = 0, w = e.percents.length; w > _; _++) {
            if (e.percents[_] == r || e.percents[_] > i * e.top) {
                r = e.percents[_], c = e.percents[_ - 1] || 0, g = g / e.top * (r - c), h = e.percents[_ + 1], o = e.anim[r];
                break
            }
            i && n.attr(e.anim[e.percents[_]])
        }
        if (o) {
            if (u)u.initstatus = i, u.start = new Date - u.ms * i; else {
                for (var B in o)if (o[k](B) && (ee[k](B) || n.paper.customAttributes[k](B)))switch (x[B] = n.attr(B), null == x[B] && (x[B] = te[B]), v[B] = o[B], ee[B]) {
                    case Y:
                        m[B] = (v[B] - x[B]) / g;
                        break;
                    case"colour":
                        x[B] = t.getRGB(x[B]);
                        var S = t.getRGB(v[B]);
                        m[B] = {r: (S.r - x[B].r) / g, g: (S.g - x[B].g) / g, b: (S.b - x[B].b) / g};
                        break;
                    case"path":
                        var C = Ie(x[B], v[B]), F = C[1];
                        for (x[B] = C[0], m[B] = [], _ = 0, w = x[B].length; w > _; _++) {
                            m[B][_] = [0];
                            for (var L = 1, A = x[B][_].length; A > L; L++)m[B][_][L] = (F[_][L] - x[B][_][L]) / g
                        }
                        break;
                    case"transform":
                        var P = n._, I = ze(P[B], v[B]);
                        if (I)for (x[B] = I.from, v[B] = I.to, m[B] = [], m[B].real = !0, _ = 0, w = x[B].length; w > _; _++)for (m[B][_] = [x[B][_][0]], L = 1, A = x[B][_].length; A > L; L++)m[B][_][L] = (v[B][_][L] - x[B][_][L]) / g; else {
                            var R = n.matrix || new f, q = {_: {transform: P.transform}, getBBox: function () {
                                return n.getBBox(1)
                            }};
                            x[B] = [R.a, R.b, R.c, R.d, R.e, R.f], je(q, v[B]), v[B] = q._.transform, m[B] = [(q.matrix.a - R.a) / g, (q.matrix.b - R.b) / g, (q.matrix.c - R.c) / g, (q.matrix.d - R.d) / g, (q.matrix.e - R.e) / g, (q.matrix.f - R.f) / g]
                        }
                        break;
                    case"csv":
                        var j = E(o[B])[M](b), D = E(x[B])[M](b);
                        if ("clip-rect" == B)for (x[B] = D, m[B] = [], _ = D.length; _--;)m[B][_] = (j[_] - x[B][_]) / g;
                        v[B] = j;
                        break;
                    default:
                        for (j = [][T](o[B]), D = [][T](x[B]), m[B] = [], _ = n.paper.customAttributes[B].length; _--;)m[B][_] = ((j[_] || 0) - (D[_] || 0)) / g
                }
                var z = o.easing, O = t.easing_formulas[z];
                if (!O)if (O = E(z).match(U), O && 5 == O.length) {
                    var V = O;
                    O = function (t) {
                        return d(t, +V[1], +V[2], +V[3], +V[4], g)
                    }
                } else O = ce;
                if (p = o.start || e.start || +new Date, y = {anim: e, percent: r, timestamp: p, start: p + (e.del || 0), status: 0, initstatus: i || 0, stop: !1, ms: g, easing: O, from: x, diff: m, to: v, el: n, callback: o.callback, prev: c, next: h, repeat: s || e.times, origin: n.attr(), totalOrigin: a}, sn.push(y), i && !u && !l && (y.stop = !0, y.start = new Date - g * i, 1 == sn.length))return un();
                l && (y.start = new Date - y.ms * i), 1 == sn.length && on(un)
            }
            eve("raphael.anim.start." + n.id, n, e)
        }
    }

    function v(t) {
        for (var e = 0; sn.length > e; e++)sn[e].el.paper == t && sn.splice(e--, 1)
    }

    t.version = "2.1.0", t.eve = eve;
    var m, y, b = /[, ]+/, _ = {circle: 1, rect: 1, path: 1, ellipse: 1, text: 1, image: 1}, w = /\{(\d+)\}/g, k = "hasOwnProperty", B = {doc: document, win: window}, S = {was: Object.prototype[k].call(B.win, "Raphael"), is: B.win.Raphael}, C = function () {
        this.ca = this.customAttributes = {}
    }, F = "apply", T = "concat", L = "createTouch"in B.doc, A = "", P = " ", E = String, M = "split", I = "click dblclick mousedown mousemove mouseout mouseover mouseup touchstart touchmove touchend touchcancel"[M](P), R = {mousedown: "touchstart", mousemove: "touchmove", mouseup: "touchend"}, q = E.prototype.toLowerCase, j = Math, D = j.max, z = j.min, O = j.abs, V = j.pow, X = j.PI, Y = "number", G = "string", N = "array", W = Object.prototype.toString, $ = (t._ISURL = /^url\(['"]?([^\)]+?)['"]?\)$/i, /^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\))\s*$/i), H = {NaN: 1, Infinity: 1, "-Infinity": 1}, U = /^(?:cubic-)?bezier\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/, Z = j.round, Q = parseFloat, J = parseInt, K = E.prototype.toUpperCase, te = t._availableAttrs = {"arrow-end": "none", "arrow-start": "none", blur: 0, "clip-rect": "0 0 1e9 1e9", cursor: "default", cx: 0, cy: 0, fill: "#fff", "fill-opacity": 1, font: '10px "Arial"', "font-family": '"Arial"', "font-size": "10", "font-style": "normal", "font-weight": 400, gradient: 0, height: 0, href: "http://raphaeljs.com/", "letter-spacing": 0, opacity: 1, path: "M0,0", r: 0, rx: 0, ry: 0, src: "", stroke: "#000", "stroke-dasharray": "", "stroke-linecap": "butt", "stroke-linejoin": "butt", "stroke-miterlimit": 0, "stroke-opacity": 1, "stroke-width": 1, target: "_blank", "text-anchor": "middle", title: "Raphael", transform: "", width: 0, x: 0, y: 0}, ee = t._availableAnimAttrs = {blur: Y, "clip-rect": "csv", cx: Y, cy: Y, fill: "colour", "fill-opacity": Y, "font-size": Y, height: Y, opacity: Y, path: "path", r: Y, rx: Y, ry: Y, stroke: "colour", "stroke-opacity": Y, "stroke-width": Y, transform: "transform", width: Y, x: Y, y: Y}, ne = /[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/, re = {hs: 1, rg: 1}, ie = /,?([achlmqrstvxz]),?/gi, ae = /([achlmrqstvz])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/gi, se = /([rstm])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/gi, oe = /(-?\d*\.?\d*(?:e[\-+]?\d+)?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/gi, ue = (t._radial_gradient = /^r(?:\(([^,]+?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*([^\)]+?)\))?/, {}), le = function (t, e) {
        return Q(t) - Q(e)
    }, he = function () {
    }, ce = function (t) {
        return t
    }, fe = t._rectPath = function (t, e, n, r, i) {
        return i ? [
            ["M", t + i, e],
            ["l", n - 2 * i, 0],
            ["a", i, i, 0, 0, 1, i, i],
            ["l", 0, r - 2 * i],
            ["a", i, i, 0, 0, 1, -i, i],
            ["l", 2 * i - n, 0],
            ["a", i, i, 0, 0, 1, -i, -i],
            ["l", 0, 2 * i - r],
            ["a", i, i, 0, 0, 1, i, -i],
            ["z"]
        ] : [
            ["M", t, e],
            ["l", n, 0],
            ["l", 0, r],
            ["l", -n, 0],
            ["z"]
        ]
    }, pe = function (t, e, n, r) {
        return null == r && (r = n), [
            ["M", t, e],
            ["m", 0, -r],
            ["a", n, r, 0, 1, 1, 0, 2 * r],
            ["a", n, r, 0, 1, 1, 0, -2 * r],
            ["z"]
        ]
    }, de = t._getPath = {path: function (t) {
        return t.attr("path")
    }, circle: function (t) {
        var e = t.attrs;
        return pe(e.cx, e.cy, e.r)
    }, ellipse: function (t) {
        var e = t.attrs;
        return pe(e.cx, e.cy, e.rx, e.ry)
    }, rect: function (t) {
        var e = t.attrs;
        return fe(e.x, e.y, e.width, e.height, e.r)
    }, image: function (t) {
        var e = t.attrs;
        return fe(e.x, e.y, e.width, e.height)
    }, text: function (t) {
        var e = t._getBBox();
        return fe(e.x, e.y, e.width, e.height)
    }, set: function (t) {
        var e = t._getBBox();
        return fe(e.x, e.y, e.width, e.height)
    }}, ge = t.mapPath = function (t, e) {
        if (!e)return t;
        var n, r, i, a, s, o, u;
        for (t = Ie(t), i = 0, s = t.length; s > i; i++)for (u = t[i], a = 1, o = u.length; o > a; a += 2)n = e.x(u[a], u[a + 1]), r = e.y(u[a], u[a + 1]), u[a] = n, u[a + 1] = r;
        return t
    };
    if (t._g = B, t.type = B.win.SVGAngle || B.doc.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") ? "SVG" : "VML", "VML" == t.type) {
        var xe, ve = B.doc.createElement("div");
        if (ve.innerHTML = '<v:shape adj="1"/>', xe = ve.firstChild, xe.style.behavior = "url(#default#VML)", !xe || "object" != typeof xe.adj)return t.type = A;
        ve = null
    }
    t.svg = !(t.vml = "VML" == t.type), t._Paper = C, t.fn = y = C.prototype = t.prototype, t._id = 0, t._oid = 0, t.is = function (t, e) {
        return e = q.call(e), "finite" == e ? !H[k](+t) : "array" == e ? t instanceof Array : "null" == e && null === t || e == typeof t && null !== t || "object" == e && t === Object(t) || "array" == e && Array.isArray && Array.isArray(t) || W.call(t).slice(8, -1).toLowerCase() == e
    }, t.angle = function (e, n, r, i, a, s) {
        if (null == a) {
            var o = e - r, u = n - i;
            return o || u ? (180 + 180 * j.atan2(-u, -o) / X + 360) % 360 : 0
        }
        return t.angle(e, n, a, s) - t.angle(r, i, a, s)
    }, t.rad = function (t) {
        return t % 360 * X / 180
    }, t.deg = function (t) {
        return 180 * t / X % 360
    }, t.snapTo = function (e, n, r) {
        if (r = t.is(r, "finite") ? r : 10, t.is(e, N)) {
            for (var i = e.length; i--;)if (r >= O(e[i] - n))return e[i]
        } else {
            e = +e;
            var a = n % e;
            if (r > a)return n - a;
            if (a > e - r)return n - a + e
        }
        return n
    }, t.createUUID = function (t, e) {
        return function () {
            return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(t, e).toUpperCase()
        }
    }(/[xy]/g, function (t) {
        var e = 0 | 16 * j.random(), n = "x" == t ? e : 8 | 3 & e;
        return n.toString(16)
    }), t.setWindow = function (e) {
        eve("raphael.setWindow", t, B.win, e), B.win = e, B.doc = B.win.document, t._engine.initWin && t._engine.initWin(B.win)
    };
    var me = function (e) {
        if (t.vml) {
            var n, i = /^\s+|\s+$/g;
            try {
                var a = new ActiveXObject("htmlfile");
                a.write("<body>"), a.close(), n = a.body
            } catch (s) {
                n = createPopup().document.body
            }
            var o = n.createTextRange();
            me = r(function (t) {
                try {
                    n.style.color = E(t).replace(i, A);
                    var e = o.queryCommandValue("ForeColor");
                    return e = (255 & e) << 16 | 65280 & e | (16711680 & e) >>> 16, "#" + ("000000" + e.toString(16)).slice(-6)
                } catch (r) {
                    return"none"
                }
            })
        } else {
            var u = B.doc.createElement("i");
            u.title = "Raphaël Colour Picker", u.style.display = "none", B.doc.body.appendChild(u), me = r(function (t) {
                return u.style.color = t, B.doc.defaultView.getComputedStyle(u, A).getPropertyValue("color")
            })
        }
        return me(e)
    }, ye = function () {
        return"hsb(" + [this.h, this.s, this.b] + ")"
    }, be = function () {
        return"hsl(" + [this.h, this.s, this.l] + ")"
    }, _e = function () {
        return this.hex
    }, we = function (e, n, r) {
        if (null == n && t.is(e, "object") && "r"in e && "g"in e && "b"in e && (r = e.b, n = e.g, e = e.r), null == n && t.is(e, G)) {
            var i = t.getRGB(e);
            e = i.r, n = i.g, r = i.b
        }
        return(e > 1 || n > 1 || r > 1) && (e /= 255, n /= 255, r /= 255), [e, n, r]
    }, ke = function (e, n, r, i) {
        e *= 255, n *= 255, r *= 255;
        var a = {r: e, g: n, b: r, hex: t.rgb(e, n, r), toString: _e};
        return t.is(i, "finite") && (a.opacity = i), a
    };
    t.color = function (e) {
        var n;
        return t.is(e, "object") && "h"in e && "s"in e && "b"in e ? (n = t.hsb2rgb(e), e.r = n.r, e.g = n.g, e.b = n.b, e.hex = n.hex) : t.is(e, "object") && "h"in e && "s"in e && "l"in e ? (n = t.hsl2rgb(e), e.r = n.r, e.g = n.g, e.b = n.b, e.hex = n.hex) : (t.is(e, "string") && (e = t.getRGB(e)), t.is(e, "object") && "r"in e && "g"in e && "b"in e ? (n = t.rgb2hsl(e), e.h = n.h, e.s = n.s, e.l = n.l, n = t.rgb2hsb(e), e.v = n.b) : (e = {hex: "none"}, e.r = e.g = e.b = e.h = e.s = e.v = e.l = -1)), e.toString = _e, e
    }, t.hsb2rgb = function (t, e, n, r) {
        this.is(t, "object") && "h"in t && "s"in t && "b"in t && (n = t.b, e = t.s, t = t.h, r = t.o), t *= 360;
        var i, a, s, o, u;
        return t = t % 360 / 60, u = n * e, o = u * (1 - O(t % 2 - 1)), i = a = s = n - u, t = ~~t, i += [u, o, 0, 0, o, u][t], a += [o, u, u, o, 0, 0][t], s += [0, 0, o, u, u, o][t], ke(i, a, s, r)
    }, t.hsl2rgb = function (t, e, n, r) {
        this.is(t, "object") && "h"in t && "s"in t && "l"in t && (n = t.l, e = t.s, t = t.h), (t > 1 || e > 1 || n > 1) && (t /= 360, e /= 100, n /= 100), t *= 360;
        var i, a, s, o, u;
        return t = t % 360 / 60, u = 2 * e * (.5 > n ? n : 1 - n), o = u * (1 - O(t % 2 - 1)), i = a = s = n - u / 2, t = ~~t, i += [u, o, 0, 0, o, u][t], a += [o, u, u, o, 0, 0][t], s += [0, 0, o, u, u, o][t], ke(i, a, s, r)
    }, t.rgb2hsb = function (t, e, n) {
        n = we(t, e, n), t = n[0], e = n[1], n = n[2];
        var r, i, a, s;
        return a = D(t, e, n), s = a - z(t, e, n), r = 0 == s ? null : a == t ? (e - n) / s : a == e ? (n - t) / s + 2 : (t - e) / s + 4, r = 60 * ((r + 360) % 6) / 360, i = 0 == s ? 0 : s / a, {h: r, s: i, b: a, toString: ye}
    }, t.rgb2hsl = function (t, e, n) {
        n = we(t, e, n), t = n[0], e = n[1], n = n[2];
        var r, i, a, s, o, u;
        return s = D(t, e, n), o = z(t, e, n), u = s - o, r = 0 == u ? null : s == t ? (e - n) / u : s == e ? (n - t) / u + 2 : (t - e) / u + 4, r = 60 * ((r + 360) % 6) / 360, a = (s + o) / 2, i = 0 == u ? 0 : .5 > a ? u / (2 * a) : u / (2 - 2 * a), {h: r, s: i, l: a, toString: be}
    }, t._path2string = function () {
        return this.join(",").replace(ie, "$1")
    }, t._preload = function (t, e) {
        var n = B.doc.createElement("img");
        n.style.cssText = "position:absolute;left:-9999em;top:-9999em", n.onload = function () {
            e.call(this), this.onload = null, B.doc.body.removeChild(this)
        }, n.onerror = function () {
            B.doc.body.removeChild(this)
        }, B.doc.body.appendChild(n), n.src = t
    }, t.getRGB = r(function (e) {
        if (!e || (e = E(e)).indexOf("-") + 1)return{r: -1, g: -1, b: -1, hex: "none", error: 1, toString: i};
        if ("none" == e)return{r: -1, g: -1, b: -1, hex: "none", toString: i};
        !(re[k](e.toLowerCase().substring(0, 2)) || "#" == e.charAt()) && (e = me(e));
        var n, r, a, s, o, u, l = e.match($);
        return l ? (l[2] && (a = J(l[2].substring(5), 16), r = J(l[2].substring(3, 5), 16), n = J(l[2].substring(1, 3), 16)), l[3] && (a = J((o = l[3].charAt(3)) + o, 16), r = J((o = l[3].charAt(2)) + o, 16), n = J((o = l[3].charAt(1)) + o, 16)), l[4] && (u = l[4][M](ne), n = Q(u[0]), "%" == u[0].slice(-1) && (n *= 2.55), r = Q(u[1]), "%" == u[1].slice(-1) && (r *= 2.55), a = Q(u[2]), "%" == u[2].slice(-1) && (a *= 2.55), "rgba" == l[1].toLowerCase().slice(0, 4) && (s = Q(u[3])), u[3] && "%" == u[3].slice(-1) && (s /= 100)), l[5] ? (u = l[5][M](ne), n = Q(u[0]), "%" == u[0].slice(-1) && (n *= 2.55), r = Q(u[1]), "%" == u[1].slice(-1) && (r *= 2.55), a = Q(u[2]), "%" == u[2].slice(-1) && (a *= 2.55), ("deg" == u[0].slice(-3) || "°" == u[0].slice(-1)) && (n /= 360), "hsba" == l[1].toLowerCase().slice(0, 4) && (s = Q(u[3])), u[3] && "%" == u[3].slice(-1) && (s /= 100), t.hsb2rgb(n, r, a, s)) : l[6] ? (u = l[6][M](ne), n = Q(u[0]), "%" == u[0].slice(-1) && (n *= 2.55), r = Q(u[1]), "%" == u[1].slice(-1) && (r *= 2.55), a = Q(u[2]), "%" == u[2].slice(-1) && (a *= 2.55), ("deg" == u[0].slice(-3) || "°" == u[0].slice(-1)) && (n /= 360), "hsla" == l[1].toLowerCase().slice(0, 4) && (s = Q(u[3])), u[3] && "%" == u[3].slice(-1) && (s /= 100), t.hsl2rgb(n, r, a, s)) : (l = {r: n, g: r, b: a, toString: i}, l.hex = "#" + (16777216 | a | r << 8 | n << 16).toString(16).slice(1), t.is(s, "finite") && (l.opacity = s), l)) : {r: -1, g: -1, b: -1, hex: "none", error: 1, toString: i}
    }, t), t.hsb = r(function (e, n, r) {
        return t.hsb2rgb(e, n, r).hex
    }), t.hsl = r(function (e, n, r) {
        return t.hsl2rgb(e, n, r).hex
    }), t.rgb = r(function (t, e, n) {
        return"#" + (16777216 | n | e << 8 | t << 16).toString(16).slice(1)
    }), t.getColor = function (t) {
        var e = this.getColor.start = this.getColor.start || {h: 0, s: 1, b: t || .75}, n = this.hsb2rgb(e.h, e.s, e.b);
        return e.h += .075, e.h > 1 && (e.h = 0, e.s -= .2, 0 >= e.s && (this.getColor.start = {h: 0, s: 1, b: e.b})), n.hex
    }, t.getColor.reset = function () {
        delete this.start
    }, t.parsePathString = function (e) {
        if (!e)return null;
        var n = Be(e);
        if (n.arr)return Ce(n.arr);
        var r = {a: 7, c: 6, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, z: 0}, i = [];
        return t.is(e, N) && t.is(e[0], N) && (i = Ce(e)), i.length || E(e).replace(ae, function (t, e, n) {
            var a = [], s = e.toLowerCase();
            if (n.replace(oe, function (t, e) {
                e && a.push(+e)
            }), "m" == s && a.length > 2 && (i.push([e][T](a.splice(0, 2))), s = "l", e = "m" == e ? "l" : "L"), "r" == s)i.push([e][T](a)); else for (; a.length >= r[s] && (i.push([e][T](a.splice(0, r[s]))), r[s]););
        }), i.toString = t._path2string, n.arr = Ce(i), i
    }, t.parseTransformString = r(function (e) {
        if (!e)return null;
        var n = [];
        return t.is(e, N) && t.is(e[0], N) && (n = Ce(e)), n.length || E(e).replace(se, function (t, e, r) {
            var i = [];
            q.call(e), r.replace(oe, function (t, e) {
                e && i.push(+e)
            }), n.push([e][T](i))
        }), n.toString = t._path2string, n
    });
    var Be = function (t) {
        var e = Be.ps = Be.ps || {};
        return e[t] ? e[t].sleep = 100 : e[t] = {sleep: 100}, setTimeout(function () {
            for (var n in e)e[k](n) && n != t && (e[n].sleep--, !e[n].sleep && delete e[n])
        }), e[t]
    };
    t.findDotsAtSegment = function (t, e, n, r, i, a, s, o, u) {
        var l = 1 - u, h = V(l, 3), c = V(l, 2), f = u * u, p = f * u, d = h * t + 3 * c * u * n + 3 * l * u * u * i + p * s, g = h * e + 3 * c * u * r + 3 * l * u * u * a + p * o, x = t + 2 * u * (n - t) + f * (i - 2 * n + t), v = e + 2 * u * (r - e) + f * (a - 2 * r + e), m = n + 2 * u * (i - n) + f * (s - 2 * i + n), y = r + 2 * u * (a - r) + f * (o - 2 * a + r), b = l * t + u * n, _ = l * e + u * r, w = l * i + u * s, k = l * a + u * o, B = 90 - 180 * j.atan2(x - m, v - y) / X;
        return(x > m || y > v) && (B += 180), {x: d, y: g, m: {x: x, y: v}, n: {x: m, y: y}, start: {x: b, y: _}, end: {x: w, y: k}, alpha: B}
    }, t.bezierBBox = function (e, n, r, i, a, s, o, u) {
        t.is(e, "array") || (e = [e, n, r, i, a, s, o, u]);
        var l = Me.apply(null, e);
        return{x: l.min.x, y: l.min.y, x2: l.max.x, y2: l.max.y, width: l.max.x - l.min.x, height: l.max.y - l.min.y}
    }, t.isPointInsideBBox = function (t, e, n) {
        return e >= t.x && t.x2 >= e && n >= t.y && t.y2 >= n
    }, t.isBBoxIntersect = function (e, n) {
        var r = t.isPointInsideBBox;
        return r(n, e.x, e.y) || r(n, e.x2, e.y) || r(n, e.x, e.y2) || r(n, e.x2, e.y2) || r(e, n.x, n.y) || r(e, n.x2, n.y) || r(e, n.x, n.y2) || r(e, n.x2, n.y2) || (e.x < n.x2 && e.x > n.x || n.x < e.x2 && n.x > e.x) && (e.y < n.y2 && e.y > n.y || n.y < e.y2 && n.y > e.y)
    }, t.pathIntersection = function (t, e) {
        return c(t, e)
    }, t.pathIntersectionNumber = function (t, e) {
        return c(t, e, 1)
    }, t.isPointInsidePath = function (e, n, r) {
        var i = t.pathBBox(e);
        return t.isPointInsideBBox(i, n, r) && 1 == c(e, [
            ["M", n, r],
            ["H", i.x2 + 10]
        ], 1) % 2
    }, t._removedFactory = function (t) {
        return function () {
            eve("raphael.log", null, "Raphaël: you are calling to method “" + t + "” of removed object", t)
        }
    };
    var Se = t.pathBBox = function (t) {
        var n = Be(t);
        if (n.bbox)return e(n.bbox);
        if (!t)return{x: 0, y: 0, width: 0, height: 0, x2: 0, y2: 0};
        t = Ie(t);
        for (var r, i = 0, a = 0, s = [], o = [], u = 0, l = t.length; l > u; u++)if (r = t[u], "M" == r[0])i = r[1], a = r[2], s.push(i), o.push(a); else {
            var h = Me(i, a, r[1], r[2], r[3], r[4], r[5], r[6]);
            s = s[T](h.min.x, h.max.x), o = o[T](h.min.y, h.max.y), i = r[5], a = r[6]
        }
        var c = z[F](0, s), f = z[F](0, o), p = D[F](0, s), d = D[F](0, o), g = p - c, x = d - f, v = {x: c, y: f, x2: p, y2: d, width: g, height: x, cx: c + g / 2, cy: f + x / 2};
        return n.bbox = e(v), v
    }, Ce = function (n) {
        var r = e(n);
        return r.toString = t._path2string, r
    }, Fe = t._pathToRelative = function (e) {
        var n = Be(e);
        if (n.rel)return Ce(n.rel);
        t.is(e, N) && t.is(e && e[0], N) || (e = t.parsePathString(e));
        var r = [], i = 0, a = 0, s = 0, o = 0, u = 0;
        "M" == e[0][0] && (i = e[0][1], a = e[0][2], s = i, o = a, u++, r.push(["M", i, a]));
        for (var l = u, h = e.length; h > l; l++) {
            var c = r[l] = [], f = e[l];
            if (f[0] != q.call(f[0]))switch (c[0] = q.call(f[0]), c[0]) {
                case"a":
                    c[1] = f[1], c[2] = f[2], c[3] = f[3], c[4] = f[4], c[5] = f[5], c[6] = +(f[6] - i).toFixed(3), c[7] = +(f[7] - a).toFixed(3);
                    break;
                case"v":
                    c[1] = +(f[1] - a).toFixed(3);
                    break;
                case"m":
                    s = f[1], o = f[2];
                default:
                    for (var p = 1, d = f.length; d > p; p++)c[p] = +(f[p] - (p % 2 ? i : a)).toFixed(3)
            } else {
                c = r[l] = [], "m" == f[0] && (s = f[1] + i, o = f[2] + a);
                for (var g = 0, x = f.length; x > g; g++)r[l][g] = f[g]
            }
            var v = r[l].length;
            switch (r[l][0]) {
                case"z":
                    i = s, a = o;
                    break;
                case"h":
                    i += +r[l][v - 1];
                    break;
                case"v":
                    a += +r[l][v - 1];
                    break;
                default:
                    i += +r[l][v - 2], a += +r[l][v - 1]
            }
        }
        return r.toString = t._path2string, n.rel = Ce(r), r
    }, Te = t._pathToAbsolute = function (e) {
        var n = Be(e);
        if (n.abs)return Ce(n.abs);
        if (t.is(e, N) && t.is(e && e[0], N) || (e = t.parsePathString(e)), !e || !e.length)return[
            ["M", 0, 0]
        ];
        var r = [], i = 0, s = 0, o = 0, u = 0, l = 0;
        "M" == e[0][0] && (i = +e[0][1], s = +e[0][2], o = i, u = s, l++, r[0] = ["M", i, s]);
        for (var h, c, f = 3 == e.length && "M" == e[0][0] && "R" == e[1][0].toUpperCase() && "Z" == e[2][0].toUpperCase(), p = l, d = e.length; d > p; p++) {
            if (r.push(h = []), c = e[p], c[0] != K.call(c[0]))switch (h[0] = K.call(c[0]), h[0]) {
                case"A":
                    h[1] = c[1], h[2] = c[2], h[3] = c[3], h[4] = c[4], h[5] = c[5], h[6] = +(c[6] + i), h[7] = +(c[7] + s);
                    break;
                case"V":
                    h[1] = +c[1] + s;
                    break;
                case"H":
                    h[1] = +c[1] + i;
                    break;
                case"R":
                    for (var g = [i, s][T](c.slice(1)), x = 2, v = g.length; v > x; x++)g[x] = +g[x] + i, g[++x] = +g[x] + s;
                    r.pop(), r = r[T](a(g, f));
                    break;
                case"M":
                    o = +c[1] + i, u = +c[2] + s;
                default:
                    for (x = 1, v = c.length; v > x; x++)h[x] = +c[x] + (x % 2 ? i : s)
            } else if ("R" == c[0])g = [i, s][T](c.slice(1)), r.pop(), r = r[T](a(g, f)), h = ["R"][T](c.slice(-2)); else for (var m = 0, y = c.length; y > m; m++)h[m] = c[m];
            switch (h[0]) {
                case"Z":
                    i = o, s = u;
                    break;
                case"H":
                    i = h[1];
                    break;
                case"V":
                    s = h[1];
                    break;
                case"M":
                    o = h[h.length - 2], u = h[h.length - 1];
                default:
                    i = h[h.length - 2], s = h[h.length - 1]
            }
        }
        return r.toString = t._path2string, n.abs = Ce(r), r
    }, Le = function (t, e, n, r) {
        return[t, e, n, r, n, r]
    }, Ae = function (t, e, n, r, i, a) {
        var s = 1 / 3, o = 2 / 3;
        return[s * t + o * n, s * e + o * r, s * i + o * n, s * a + o * r, i, a]
    }, Pe = function (t, e, n, i, a, s, o, u, l, h) {
        var c, f = 120 * X / 180, p = X / 180 * (+a || 0), d = [], g = r(function (t, e, n) {
            var r = t * j.cos(n) - e * j.sin(n), i = t * j.sin(n) + e * j.cos(n);
            return{x: r, y: i}
        });
        if (h)B = h[0], S = h[1], w = h[2], k = h[3]; else {
            c = g(t, e, -p), t = c.x, e = c.y, c = g(u, l, -p), u = c.x, l = c.y;
            var x = (j.cos(X / 180 * a), j.sin(X / 180 * a), (t - u) / 2), v = (e - l) / 2, m = x * x / (n * n) + v * v / (i * i);
            m > 1 && (m = j.sqrt(m), n = m * n, i = m * i);
            var y = n * n, b = i * i, _ = (s == o ? -1 : 1) * j.sqrt(O((y * b - y * v * v - b * x * x) / (y * v * v + b * x * x))), w = _ * n * v / i + (t + u) / 2, k = _ * -i * x / n + (e + l) / 2, B = j.asin(((e - k) / i).toFixed(9)), S = j.asin(((l - k) / i).toFixed(9));
            B = w > t ? X - B : B, S = w > u ? X - S : S, 0 > B && (B = 2 * X + B), 0 > S && (S = 2 * X + S), o && B > S && (B -= 2 * X), !o && S > B && (S -= 2 * X)
        }
        var C = S - B;
        if (O(C) > f) {
            var F = S, L = u, A = l;
            S = B + f * (o && S > B ? 1 : -1), u = w + n * j.cos(S), l = k + i * j.sin(S), d = Pe(u, l, n, i, a, 0, o, L, A, [S, F, w, k])
        }
        C = S - B;
        var P = j.cos(B), E = j.sin(B), I = j.cos(S), R = j.sin(S), q = j.tan(C / 4), D = 4 / 3 * n * q, z = 4 / 3 * i * q, V = [t, e], Y = [t + D * E, e - z * P], G = [u + D * R, l - z * I], N = [u, l];
        if (Y[0] = 2 * V[0] - Y[0], Y[1] = 2 * V[1] - Y[1], h)return[Y, G, N][T](d);
        d = [Y, G, N][T](d).join()[M](",");
        for (var W = [], $ = 0, H = d.length; H > $; $++)W[$] = $ % 2 ? g(d[$ - 1], d[$], p).y : g(d[$], d[$ + 1], p).x;
        return W
    }, Ee = function (t, e, n, r, i, a, s, o, u) {
        var l = 1 - u;
        return{x: V(l, 3) * t + 3 * V(l, 2) * u * n + 3 * l * u * u * i + V(u, 3) * s, y: V(l, 3) * e + 3 * V(l, 2) * u * r + 3 * l * u * u * a + V(u, 3) * o}
    }, Me = r(function (t, e, n, r, i, a, s, o) {
        var u, l = i - 2 * n + t - (s - 2 * i + n), h = 2 * (n - t) - 2 * (i - n), c = t - n, f = (-h + j.sqrt(h * h - 4 * l * c)) / 2 / l, p = (-h - j.sqrt(h * h - 4 * l * c)) / 2 / l, d = [e, o], g = [t, s];
        return O(f) > "1e12" && (f = .5), O(p) > "1e12" && (p = .5), f > 0 && 1 > f && (u = Ee(t, e, n, r, i, a, s, o, f), g.push(u.x), d.push(u.y)), p > 0 && 1 > p && (u = Ee(t, e, n, r, i, a, s, o, p), g.push(u.x), d.push(u.y)), l = a - 2 * r + e - (o - 2 * a + r), h = 2 * (r - e) - 2 * (a - r), c = e - r, f = (-h + j.sqrt(h * h - 4 * l * c)) / 2 / l, p = (-h - j.sqrt(h * h - 4 * l * c)) / 2 / l, O(f) > "1e12" && (f = .5), O(p) > "1e12" && (p = .5), f > 0 && 1 > f && (u = Ee(t, e, n, r, i, a, s, o, f), g.push(u.x), d.push(u.y)), p > 0 && 1 > p && (u = Ee(t, e, n, r, i, a, s, o, p), g.push(u.x), d.push(u.y)), {min: {x: z[F](0, g), y: z[F](0, d)}, max: {x: D[F](0, g), y: D[F](0, d)}}
    }), Ie = t._path2curve = r(function (t, e) {
        var n = !e && Be(t);
        if (!e && n.curve)return Ce(n.curve);
        for (var r = Te(t), i = e && Te(e), a = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null}, s = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null}, o = (function (t, e) {
            var n, r;
            if (!t)return["C", e.x, e.y, e.x, e.y, e.x, e.y];
            switch (!(t[0]in{T: 1, Q: 1}) && (e.qx = e.qy = null), t[0]) {
                case"M":
                    e.X = t[1], e.Y = t[2];
                    break;
                case"A":
                    t = ["C"][T](Pe[F](0, [e.x, e.y][T](t.slice(1))));
                    break;
                case"S":
                    n = e.x + (e.x - (e.bx || e.x)), r = e.y + (e.y - (e.by || e.y)), t = ["C", n, r][T](t.slice(1));
                    break;
                case"T":
                    e.qx = e.x + (e.x - (e.qx || e.x)), e.qy = e.y + (e.y - (e.qy || e.y)), t = ["C"][T](Ae(e.x, e.y, e.qx, e.qy, t[1], t[2]));
                    break;
                case"Q":
                    e.qx = t[1], e.qy = t[2], t = ["C"][T](Ae(e.x, e.y, t[1], t[2], t[3], t[4]));
                    break;
                case"L":
                    t = ["C"][T](Le(e.x, e.y, t[1], t[2]));
                    break;
                case"H":
                    t = ["C"][T](Le(e.x, e.y, t[1], e.y));
                    break;
                case"V":
                    t = ["C"][T](Le(e.x, e.y, e.x, t[1]));
                    break;
                case"Z":
                    t = ["C"][T](Le(e.x, e.y, e.X, e.Y))
            }
            return t
        }), u = function (t, e) {
            if (t[e].length > 7) {
                t[e].shift();
                for (var n = t[e]; n.length;)t.splice(e++, 0, ["C"][T](n.splice(0, 6)));
                t.splice(e, 1), c = D(r.length, i && i.length || 0)
            }
        }, l = function (t, e, n, a, s) {
            t && e && "M" == t[s][0] && "M" != e[s][0] && (e.splice(s, 0, ["M", a.x, a.y]), n.bx = 0, n.by = 0, n.x = t[s][1], n.y = t[s][2], c = D(r.length, i && i.length || 0))
        }, h = 0, c = D(r.length, i && i.length || 0); c > h; h++) {
            r[h] = o(r[h], a), u(r, h), i && (i[h] = o(i[h], s)), i && u(i, h), l(r, i, a, s, h), l(i, r, s, a, h);
            var f = r[h], p = i && i[h], d = f.length, g = i && p.length;
            a.x = f[d - 2], a.y = f[d - 1], a.bx = Q(f[d - 4]) || a.x, a.by = Q(f[d - 3]) || a.y, s.bx = i && (Q(p[g - 4]) || s.x), s.by = i && (Q(p[g - 3]) || s.y), s.x = i && p[g - 2], s.y = i && p[g - 1]
        }
        return i || (n.curve = Ce(r)), i ? [r, i] : r
    }, null, Ce), Re = (t._parseDots = r(function (e) {
        for (var n = [], r = 0, i = e.length; i > r; r++) {
            var a = {}, s = e[r].match(/^([^:]*):?([\d\.]*)/);
            if (a.color = t.getRGB(s[1]), a.color.error)return null;
            a.color = a.color.hex, s[2] && (a.offset = s[2] + "%"), n.push(a)
        }
        for (r = 1, i = n.length - 1; i > r; r++)if (!n[r].offset) {
            for (var o = Q(n[r - 1].offset || 0), u = 0, l = r + 1; i > l; l++)if (n[l].offset) {
                u = n[l].offset;
                break
            }
            u || (u = 100, l = i), u = Q(u);
            for (var h = (u - o) / (l - r + 1); l > r; r++)o += h, n[r].offset = o + "%"
        }
        return n
    }), t._tear = function (t, e) {
        t == e.top && (e.top = t.prev), t == e.bottom && (e.bottom = t.next), t.next && (t.next.prev = t.prev), t.prev && (t.prev.next = t.next)
    }), qe = (t._tofront = function (t, e) {
        e.top !== t && (Re(t, e), t.next = null, t.prev = e.top, e.top.next = t, e.top = t)
    }, t._toback = function (t, e) {
        e.bottom !== t && (Re(t, e), t.next = e.bottom, t.prev = null, e.bottom.prev = t, e.bottom = t)
    }, t._insertafter = function (t, e, n) {
        Re(t, n), e == n.top && (n.top = t), e.next && (e.next.prev = t), t.next = e.next, t.prev = e, e.next = t
    }, t._insertbefore = function (t, e, n) {
        Re(t, n), e == n.bottom && (n.bottom = t), e.prev && (e.prev.next = t), t.prev = e.prev, e.prev = t, t.next = e
    }, t.toMatrix = function (t, e) {
        var n = Se(t), r = {_: {transform: A}, getBBox: function () {
            return n
        }};
        return je(r, e), r.matrix
    }), je = (t.transformPath = function (t, e) {
        return ge(t, qe(t, e))
    }, t._extractTransform = function (e, n) {
        if (null == n)return e._.transform;
        n = E(n).replace(/\.{3}|\u2026/g, e._.transform || A);
        var r = t.parseTransformString(n), i = 0, a = 0, s = 0, o = 1, u = 1, l = e._, h = new f;
        if (l.transform = r || [], r)for (var c = 0, p = r.length; p > c; c++) {
            var d, g, x, v, m, y = r[c], b = y.length, _ = E(y[0]).toLowerCase(), w = y[0] != _, k = w ? h.invert() : 0;
            "t" == _ && 3 == b ? w ? (d = k.x(0, 0), g = k.y(0, 0), x = k.x(y[1], y[2]), v = k.y(y[1], y[2]), h.translate(x - d, v - g)) : h.translate(y[1], y[2]) : "r" == _ ? 2 == b ? (m = m || e.getBBox(1), h.rotate(y[1], m.x + m.width / 2, m.y + m.height / 2), i += y[1]) : 4 == b && (w ? (x = k.x(y[2], y[3]), v = k.y(y[2], y[3]), h.rotate(y[1], x, v)) : h.rotate(y[1], y[2], y[3]), i += y[1]) : "s" == _ ? 2 == b || 3 == b ? (m = m || e.getBBox(1), h.scale(y[1], y[b - 1], m.x + m.width / 2, m.y + m.height / 2), o *= y[1], u *= y[b - 1]) : 5 == b && (w ? (x = k.x(y[3], y[4]), v = k.y(y[3], y[4]), h.scale(y[1], y[2], x, v)) : h.scale(y[1], y[2], y[3], y[4]), o *= y[1], u *= y[2]) : "m" == _ && 7 == b && h.add(y[1], y[2], y[3], y[4], y[5], y[6]), l.dirtyT = 1, e.matrix = h
        }
        e.matrix = h, l.sx = o, l.sy = u, l.deg = i, l.dx = a = h.e, l.dy = s = h.f, 1 == o && 1 == u && !i && l.bbox ? (l.bbox.x += +a, l.bbox.y += +s) : l.dirtyT = 1
    }), De = function (t) {
        var e = t[0];
        switch (e.toLowerCase()) {
            case"t":
                return[e, 0, 0];
            case"m":
                return[e, 1, 0, 0, 1, 0, 0];
            case"r":
                return 4 == t.length ? [e, 0, t[2], t[3]] : [e, 0];
            case"s":
                return 5 == t.length ? [e, 1, 1, t[3], t[4]] : 3 == t.length ? [e, 1, 1] : [e, 1]
        }
    }, ze = t._equaliseTransform = function (e, n) {
        n = E(n).replace(/\.{3}|\u2026/g, e), e = t.parseTransformString(e) || [], n = t.parseTransformString(n) || [];
        for (var r, i, a, s, o = D(e.length, n.length), u = [], l = [], h = 0; o > h; h++) {
            if (a = e[h] || De(n[h]), s = n[h] || De(a), a[0] != s[0] || "r" == a[0].toLowerCase() && (a[2] != s[2] || a[3] != s[3]) || "s" == a[0].toLowerCase() && (a[3] != s[3] || a[4] != s[4]))return;
            for (u[h] = [], l[h] = [], r = 0, i = D(a.length, s.length); i > r; r++)r in a && (u[h][r] = a[r]), r in s && (l[h][r] = s[r])
        }
        return{from: u, to: l}
    };
    t._getContainer = function (e, n, r, i) {
        var a;
        return a = null != i || t.is(e, "object") ? e : B.doc.getElementById(e), null != a ? a.tagName ? null == n ? {container: a, width: a.style.pixelWidth || a.offsetWidth, height: a.style.pixelHeight || a.offsetHeight} : {container: a, width: n, height: r} : {container: 1, x: e, y: n, width: r, height: i} : void 0
    }, t.pathToRelative = Fe, t._engine = {}, t.path2curve = Ie, t.matrix = function (t, e, n, r, i, a) {
        return new f(t, e, n, r, i, a)
    }, function (e) {
        function n(t) {
            return t[0] * t[0] + t[1] * t[1]
        }

        function r(t) {
            var e = j.sqrt(n(t));
            t[0] && (t[0] /= e), t[1] && (t[1] /= e)
        }

        e.add = function (t, e, n, r, i, a) {
            var s, o, u, l, h = [
                [],
                [],
                []
            ], c = [
                [this.a, this.c, this.e],
                [this.b, this.d, this.f],
                [0, 0, 1]
            ], p = [
                [t, n, i],
                [e, r, a],
                [0, 0, 1]
            ];
            for (t && t instanceof f && (p = [
                [t.a, t.c, t.e],
                [t.b, t.d, t.f],
                [0, 0, 1]
            ]), s = 0; 3 > s; s++)for (o = 0; 3 > o; o++) {
                for (l = 0, u = 0; 3 > u; u++)l += c[s][u] * p[u][o];
                h[s][o] = l
            }
            this.a = h[0][0], this.b = h[1][0], this.c = h[0][1], this.d = h[1][1], this.e = h[0][2], this.f = h[1][2]
        }, e.invert = function () {
            var t = this, e = t.a * t.d - t.b * t.c;
            return new f(t.d / e, -t.b / e, -t.c / e, t.a / e, (t.c * t.f - t.d * t.e) / e, (t.b * t.e - t.a * t.f) / e)
        }, e.clone = function () {
            return new f(this.a, this.b, this.c, this.d, this.e, this.f)
        }, e.translate = function (t, e) {
            this.add(1, 0, 0, 1, t, e)
        }, e.scale = function (t, e, n, r) {
            null == e && (e = t), (n || r) && this.add(1, 0, 0, 1, n, r), this.add(t, 0, 0, e, 0, 0), (n || r) && this.add(1, 0, 0, 1, -n, -r)
        }, e.rotate = function (e, n, r) {
            e = t.rad(e), n = n || 0, r = r || 0;
            var i = +j.cos(e).toFixed(9), a = +j.sin(e).toFixed(9);
            this.add(i, a, -a, i, n, r), this.add(1, 0, 0, 1, -n, -r)
        }, e.x = function (t, e) {
            return t * this.a + e * this.c + this.e
        }, e.y = function (t, e) {
            return t * this.b + e * this.d + this.f
        }, e.get = function (t) {
            return+this[E.fromCharCode(97 + t)].toFixed(4)
        }, e.toString = function () {
            return t.svg ? "matrix(" + [this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5)].join() + ")" : [this.get(0), this.get(2), this.get(1), this.get(3), 0, 0].join()
        }, e.toFilter = function () {
            return"progid:DXImageTransform.Microsoft.Matrix(M11=" + this.get(0) + ", M12=" + this.get(2) + ", M21=" + this.get(1) + ", M22=" + this.get(3) + ", Dx=" + this.get(4) + ", Dy=" + this.get(5) + ", sizingmethod='auto expand')"
        }, e.offset = function () {
            return[this.e.toFixed(4), this.f.toFixed(4)]
        }, e.split = function () {
            var e = {};
            e.dx = this.e, e.dy = this.f;
            var i = [
                [this.a, this.c],
                [this.b, this.d]
            ];
            e.scalex = j.sqrt(n(i[0])), r(i[0]), e.shear = i[0][0] * i[1][0] + i[0][1] * i[1][1], i[1] = [i[1][0] - i[0][0] * e.shear, i[1][1] - i[0][1] * e.shear], e.scaley = j.sqrt(n(i[1])), r(i[1]), e.shear /= e.scaley;
            var a = -i[0][1], s = i[1][1];
            return 0 > s ? (e.rotate = t.deg(j.acos(s)), 0 > a && (e.rotate = 360 - e.rotate)) : e.rotate = t.deg(j.asin(a)), e.isSimple = !(+e.shear.toFixed(9) || e.scalex.toFixed(9) != e.scaley.toFixed(9) && e.rotate), e.isSuperSimple = !+e.shear.toFixed(9) && e.scalex.toFixed(9) == e.scaley.toFixed(9) && !e.rotate, e.noRotation = !+e.shear.toFixed(9) && !e.rotate, e
        }, e.toTransformString = function (t) {
            var e = t || this[M]();
            return e.isSimple ? (e.scalex = +e.scalex.toFixed(4), e.scaley = +e.scaley.toFixed(4), e.rotate = +e.rotate.toFixed(4), (e.dx || e.dy ? "t" + [e.dx, e.dy] : A) + (1 != e.scalex || 1 != e.scaley ? "s" + [e.scalex, e.scaley, 0, 0] : A) + (e.rotate ? "r" + [e.rotate, 0, 0] : A)) : "m" + [this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5)]
        }
    }(f.prototype);
    var Oe = navigator.userAgent.match(/Version\/(.*?)\s/) || navigator.userAgent.match(/Chrome\/(\d+)/);
    y.safari = "Apple Computer, Inc." == navigator.vendor && (Oe && 4 > Oe[1] || "iP" == navigator.platform.slice(0, 2)) || "Google Inc." == navigator.vendor && Oe && 8 > Oe[1] ? function () {
        var t = this.rect(-99, -99, this.width + 99, this.height + 99).attr({stroke: "none"});
        setTimeout(function () {
            t.remove()
        })
    } : he;
    for (var Ve = function () {
        this.returnValue = !1
    }, Xe = function () {
        return this.originalEvent.preventDefault()
    }, Ye = function () {
        this.cancelBubble = !0
    }, Ge = function () {
        return this.originalEvent.stopPropagation()
    }, Ne = function () {
        return B.doc.addEventListener ? function (t, e, n, r) {
            var i = L && R[e] ? R[e] : e, a = function (i) {
                var a = B.doc.documentElement.scrollTop || B.doc.body.scrollTop, s = B.doc.documentElement.scrollLeft || B.doc.body.scrollLeft, o = i.clientX + s, u = i.clientY + a;
                if (L && R[k](e))for (var l = 0, h = i.targetTouches && i.targetTouches.length; h > l; l++)if (i.targetTouches[l].target == t) {
                    var c = i;
                    i = i.targetTouches[l], i.originalEvent = c, i.preventDefault = Xe, i.stopPropagation = Ge;
                    break
                }
                return n.call(r, i, o, u)
            };
            return t.addEventListener(i, a, !1), function () {
                return t.removeEventListener(i, a, !1), !0
            }
        } : B.doc.attachEvent ? function (t, e, n, r) {
            var i = function (t) {
                t = t || B.win.event;
                var e = B.doc.documentElement.scrollTop || B.doc.body.scrollTop, i = B.doc.documentElement.scrollLeft || B.doc.body.scrollLeft, a = t.clientX + i, s = t.clientY + e;
                return t.preventDefault = t.preventDefault || Ve, t.stopPropagation = t.stopPropagation || Ye, n.call(r, t, a, s)
            };
            t.attachEvent("on" + e, i);
            var a = function () {
                return t.detachEvent("on" + e, i), !0
            };
            return a
        } : void 0
    }(), We = [], $e = function (t) {
        for (var e, n = t.clientX, r = t.clientY, i = B.doc.documentElement.scrollTop || B.doc.body.scrollTop, a = B.doc.documentElement.scrollLeft || B.doc.body.scrollLeft, s = We.length; s--;) {
            if (e = We[s], L) {
                for (var o, u = t.touches.length; u--;)if (o = t.touches[u], o.identifier == e.el._drag.id) {
                    n = o.clientX, r = o.clientY, (t.originalEvent ? t.originalEvent : t).preventDefault();
                    break
                }
            } else t.preventDefault();
            var l, h = e.el.node, c = h.nextSibling, f = h.parentNode, p = h.style.display;
            B.win.opera && f.removeChild(h), h.style.display = "none", l = e.el.paper.getElementByPoint(n, r), h.style.display = p, B.win.opera && (c ? f.insertBefore(h, c) : f.appendChild(h)), l && eve("raphael.drag.over." + e.el.id, e.el, l), n += a, r += i, eve("raphael.drag.move." + e.el.id, e.move_scope || e.el, n - e.el._drag.x, r - e.el._drag.y, n, r, t)
        }
    }, He = function (e) {
        t.unmousemove($e).unmouseup(He);
        for (var n, r = We.length; r--;)n = We[r], n.el._drag = {}, eve("raphael.drag.end." + n.el.id, n.end_scope || n.start_scope || n.move_scope || n.el, e);
        We = []
    }, Ue = t.el = {}, Ze = I.length; Ze--;)(function (e) {
        t[e] = Ue[e] = function (n, r) {
            return t.is(n, "function") && (this.events = this.events || [], this.events.push({name: e, f: n, unbind: Ne(this.shape || this.node || B.doc, e, n, r || this)})), this
        }, t["un" + e] = Ue["un" + e] = function (t) {
            for (var n = this.events || [], r = n.length; r--;)if (n[r].name == e && n[r].f == t)return n[r].unbind(), n.splice(r, 1), !n.length && delete this.events, this;
            return this
        }
    })(I[Ze]);
    Ue.data = function (e, n) {
        var r = ue[this.id] = ue[this.id] || {};
        if (1 == arguments.length) {
            if (t.is(e, "object")) {
                for (var i in e)e[k](i) && this.data(i, e[i]);
                return this
            }
            return eve("raphael.data.get." + this.id, this, r[e], e), r[e]
        }
        return r[e] = n, eve("raphael.data.set." + this.id, this, n, e), this
    }, Ue.removeData = function (t) {
        return null == t ? ue[this.id] = {} : ue[this.id] && delete ue[this.id][t], this
    }, Ue.getData = function () {
        return e(ue[this.id] || {})
    }, Ue.hover = function (t, e, n, r) {
        return this.mouseover(t, n).mouseout(e, r || n)
    }, Ue.unhover = function (t, e) {
        return this.unmouseover(t).unmouseout(e)
    };
    var Qe = [];
    Ue.drag = function (e, n, r, i, a, s) {
        function o(o) {
            (o.originalEvent || o).preventDefault();
            var u = B.doc.documentElement.scrollTop || B.doc.body.scrollTop, l = B.doc.documentElement.scrollLeft || B.doc.body.scrollLeft;
            this._drag.x = o.clientX + l, this._drag.y = o.clientY + u, this._drag.id = o.identifier, !We.length && t.mousemove($e).mouseup(He), We.push({el: this, move_scope: i, start_scope: a, end_scope: s}), n && eve.on("raphael.drag.start." + this.id, n), e && eve.on("raphael.drag.move." + this.id, e), r && eve.on("raphael.drag.end." + this.id, r), eve("raphael.drag.start." + this.id, a || i || this, o.clientX + l, o.clientY + u, o)
        }

        return this._drag = {}, Qe.push({el: this, start: o}), this.mousedown(o), this
    }, Ue.onDragOver = function (t) {
        t ? eve.on("raphael.drag.over." + this.id, t) : eve.unbind("raphael.drag.over." + this.id)
    }, Ue.undrag = function () {
        for (var e = Qe.length; e--;)Qe[e].el == this && (this.unmousedown(Qe[e].start), Qe.splice(e, 1), eve.unbind("raphael.drag.*." + this.id));
        !Qe.length && t.unmousemove($e).unmouseup(He), We = []
    }, y.circle = function (e, n, r) {
        var i = t._engine.circle(this, e || 0, n || 0, r || 0);
        return this.__set__ && this.__set__.push(i), i
    }, y.rect = function (e, n, r, i, a) {
        var s = t._engine.rect(this, e || 0, n || 0, r || 0, i || 0, a || 0);
        return this.__set__ && this.__set__.push(s), s
    }, y.ellipse = function (e, n, r, i) {
        var a = t._engine.ellipse(this, e || 0, n || 0, r || 0, i || 0);
        return this.__set__ && this.__set__.push(a), a
    }, y.path = function (e) {
        e && !t.is(e, G) && !t.is(e[0], N) && (e += A);
        var n = t._engine.path(t.format[F](t, arguments), this);
        return this.__set__ && this.__set__.push(n), n
    }, y.image = function (e, n, r, i, a) {
        var s = t._engine.image(this, e || "about:blank", n || 0, r || 0, i || 0, a || 0);
        return this.__set__ && this.__set__.push(s), s
    }, y.text = function (e, n, r) {
        var i = t._engine.text(this, e || 0, n || 0, E(r));
        return this.__set__ && this.__set__.push(i), i
    }, y.set = function (e) {
        !t.is(e, "array") && (e = Array.prototype.splice.call(arguments, 0, arguments.length));
        var n = new hn(e);
        return this.__set__ && this.__set__.push(n), n.paper = this, n.type = "set", n
    }, y.setStart = function (t) {
        this.__set__ = t || this.set()
    }, y.setFinish = function () {
        var t = this.__set__;
        return delete this.__set__, t
    }, y.setSize = function (e, n) {
        return t._engine.setSize.call(this, e, n)
    }, y.setViewBox = function (e, n, r, i, a) {
        return t._engine.setViewBox.call(this, e, n, r, i, a)
    }, y.top = y.bottom = null, y.raphael = t;
    var Je = function (t) {
        var e = t.getBoundingClientRect(), n = t.ownerDocument, r = n.body, i = n.documentElement, a = i.clientTop || r.clientTop || 0, s = i.clientLeft || r.clientLeft || 0, o = e.top + (B.win.pageYOffset || i.scrollTop || r.scrollTop) - a, u = e.left + (B.win.pageXOffset || i.scrollLeft || r.scrollLeft) - s;
        return{y: o, x: u}
    };
    y.getElementByPoint = function (t, e) {
        var n = this, r = n.canvas, i = B.doc.elementFromPoint(t, e);
        if (B.win.opera && "svg" == i.tagName) {
            var a = Je(r), s = r.createSVGRect();
            s.x = t - a.x, s.y = e - a.y, s.width = s.height = 1;
            var o = r.getIntersectionList(s, null);
            o.length && (i = o[o.length - 1])
        }
        if (!i)return null;
        for (; i.parentNode && i != r.parentNode && !i.raphael;)i = i.parentNode;
        return i == n.canvas.parentNode && (i = r), i = i && i.raphael ? n.getById(i.raphaelid) : null
    }, y.getElementsByBBox = function (e) {
        var n = this.set();
        return this.forEach(function (r) {
            t.isBBoxIntersect(r.getBBox(), e) && n.push(r)
        }), n
    }, y.getById = function (t) {
        for (var e = this.bottom; e;) {
            if (e.id == t)return e;
            e = e.next
        }
        return null
    }, y.forEach = function (t, e) {
        for (var n = this.bottom; n;) {
            if (t.call(e, n) === !1)return this;
            n = n.next
        }
        return this
    }, y.getElementsByPoint = function (t, e) {
        var n = this.set();
        return this.forEach(function (r) {
            r.isPointInside(t, e) && n.push(r)
        }), n
    }, Ue.isPointInside = function (e, n) {
        var r = this.realPath = this.realPath || de[this.type](this);
        return t.isPointInsidePath(r, e, n)
    }, Ue.getBBox = function (t) {
        if (this.removed)return{};
        var e = this._;
        return t ? ((e.dirty || !e.bboxwt) && (this.realPath = de[this.type](this), e.bboxwt = Se(this.realPath), e.bboxwt.toString = p, e.dirty = 0), e.bboxwt) : ((e.dirty || e.dirtyT || !e.bbox) && ((e.dirty || !this.realPath) && (e.bboxwt = 0, this.realPath = de[this.type](this)), e.bbox = Se(ge(this.realPath, this.matrix)), e.bbox.toString = p, e.dirty = e.dirtyT = 0), e.bbox)
    }, Ue.clone = function () {
        if (this.removed)return null;
        var t = this.paper[this.type]().attr(this.attr());
        return this.__set__ && this.__set__.push(t), t
    }, Ue.glow = function (t) {
        if ("text" == this.type)return null;
        t = t || {};
        var e = {width: (t.width || 10) + (+this.attr("stroke-width") || 1), fill: t.fill || !1, opacity: t.opacity || .5, offsetx: t.offsetx || 0, offsety: t.offsety || 0, color: t.color || "#000"}, n = e.width / 2, r = this.paper, i = r.set(), a = this.realPath || de[this.type](this);
        a = this.matrix ? ge(a, this.matrix) : a;
        for (var s = 1; n + 1 > s; s++)i.push(r.path(a).attr({stroke: e.color, fill: e.fill ? e.color : "none", "stroke-linejoin": "round", "stroke-linecap": "round", "stroke-width": +(e.width / n * s).toFixed(3), opacity: +(e.opacity / n).toFixed(3)}));
        return i.insertBefore(this).translate(e.offsetx, e.offsety)
    };
    var Ke = function (e, n, r, i, a, s, l, h, c) {
        return null == c ? o(e, n, r, i, a, s, l, h) : t.findDotsAtSegment(e, n, r, i, a, s, l, h, u(e, n, r, i, a, s, l, h, c))
    }, tn = function (e, n) {
        return function (r, i, a) {
            r = Ie(r);
            for (var s, o, u, l, h, c = "", f = {}, p = 0, d = 0, g = r.length; g > d; d++) {
                if (u = r[d], "M" == u[0])s = +u[1], o = +u[2]; else {
                    if (l = Ke(s, o, u[1], u[2], u[3], u[4], u[5], u[6]), p + l > i) {
                        if (n && !f.start) {
                            if (h = Ke(s, o, u[1], u[2], u[3], u[4], u[5], u[6], i - p), c += ["C" + h.start.x, h.start.y, h.m.x, h.m.y, h.x, h.y], a)return c;
                            f.start = c, c = ["M" + h.x, h.y + "C" + h.n.x, h.n.y, h.end.x, h.end.y, u[5], u[6]].join(), p += l, s = +u[5], o = +u[6];
                            continue
                        }
                        if (!e && !n)return h = Ke(s, o, u[1], u[2], u[3], u[4], u[5], u[6], i - p), {x: h.x, y: h.y, alpha: h.alpha}
                    }
                    p += l, s = +u[5], o = +u[6]
                }
                c += u.shift() + u
            }
            return f.end = c, h = e ? p : n ? f : t.findDotsAtSegment(s, o, u[0], u[1], u[2], u[3], u[4], u[5], 1), h.alpha && (h = {x: h.x, y: h.y, alpha: h.alpha}), h
        }
    }, en = tn(1), nn = tn(), rn = tn(0, 1);
    t.getTotalLength = en, t.getPointAtLength = nn, t.getSubpath = function (t, e, n) {
        if (1e-6 > this.getTotalLength(t) - n)return rn(t, e).end;
        var r = rn(t, n, 1);
        return e ? rn(r, e).end : r
    }, Ue.getTotalLength = function () {
        return"path" == this.type ? this.node.getTotalLength ? this.node.getTotalLength() : en(this.attrs.path) : void 0
    }, Ue.getPointAtLength = function (t) {
        return"path" == this.type ? nn(this.attrs.path, t) : void 0
    }, Ue.getSubpath = function (e, n) {
        return"path" == this.type ? t.getSubpath(this.attrs.path, e, n) : void 0
    };
    var an = t.easing_formulas = {linear: function (t) {
        return t
    }, "<": function (t) {
        return V(t, 1.7)
    }, ">": function (t) {
        return V(t, .48)
    }, "<>": function (t) {
        var e = .48 - t / 1.04, n = j.sqrt(.1734 + e * e), r = n - e, i = V(O(r), 1 / 3) * (0 > r ? -1 : 1), a = -n - e, s = V(O(a), 1 / 3) * (0 > a ? -1 : 1), o = i + s + .5;
        return 3 * (1 - o) * o * o + o * o * o
    }, backIn: function (t) {
        var e = 1.70158;
        return t * t * ((e + 1) * t - e)
    }, backOut: function (t) {
        t -= 1;
        var e = 1.70158;
        return t * t * ((e + 1) * t + e) + 1
    }, elastic: function (t) {
        return t == !!t ? t : V(2, -10 * t) * j.sin((t - .075) * 2 * X / .3) + 1
    }, bounce: function (t) {
        var e, n = 7.5625, r = 2.75;
        return 1 / r > t ? e = n * t * t : 2 / r > t ? (t -= 1.5 / r, e = n * t * t + .75) : 2.5 / r > t ? (t -= 2.25 / r, e = n * t * t + .9375) : (t -= 2.625 / r, e = n * t * t + .984375), e
    }};
    an.easeIn = an["ease-in"] = an["<"], an.easeOut = an["ease-out"] = an[">"], an.easeInOut = an["ease-in-out"] = an["<>"], an["back-in"] = an.backIn, an["back-out"] = an.backOut;
    var sn = [], on = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (t) {
        setTimeout(t, 16)
    }, un = function () {
        for (var e = +new Date, n = 0; sn.length > n; n++) {
            var r = sn[n];
            if (!r.el.removed && !r.paused) {
                var i, a, s = e - r.start, o = r.ms, u = r.easing, l = r.from, h = r.diff, c = r.to, f = (r.t, r.el), p = {}, d = {};
                if (r.initstatus ? (s = (r.initstatus * r.anim.top - r.prev) / (r.percent - r.prev) * o, r.status = r.initstatus, delete r.initstatus, r.stop && sn.splice(n--, 1)) : r.status = (r.prev + (r.percent - r.prev) * (s / o)) / r.anim.top, !(0 > s))if (o > s) {
                    var g = u(s / o);
                    for (var v in l)if (l[k](v)) {
                        switch (ee[v]) {
                            case Y:
                                i = +l[v] + g * o * h[v];
                                break;
                            case"colour":
                                i = "rgb(" + [ln(Z(l[v].r + g * o * h[v].r)), ln(Z(l[v].g + g * o * h[v].g)), ln(Z(l[v].b + g * o * h[v].b))].join(",") + ")";
                                break;
                            case"path":
                                i = [];
                                for (var m = 0, y = l[v].length; y > m; m++) {
                                    i[m] = [l[v][m][0]];
                                    for (var b = 1, _ = l[v][m].length; _ > b; b++)i[m][b] = +l[v][m][b] + g * o * h[v][m][b];
                                    i[m] = i[m].join(P)
                                }
                                i = i.join(P);
                                break;
                            case"transform":
                                if (h[v].real)for (i = [], m = 0, y = l[v].length; y > m; m++)for (i[m] = [l[v][m][0]], b = 1, _ = l[v][m].length; _ > b; b++)i[m][b] = l[v][m][b] + g * o * h[v][m][b]; else {
                                    var w = function (t) {
                                        return+l[v][t] + g * o * h[v][t]
                                    };
                                    i = [
                                        ["m", w(0), w(1), w(2), w(3), w(4), w(5)]
                                    ]
                                }
                                break;
                            case"csv":
                                if ("clip-rect" == v)for (i = [], m = 4; m--;)i[m] = +l[v][m] + g * o * h[v][m];
                                break;
                            default:
                                var B = [][T](l[v]);
                                for (i = [], m = f.paper.customAttributes[v].length; m--;)i[m] = +B[m] + g * o * h[v][m]
                        }
                        p[v] = i
                    }
                    f.attr(p), function (t, e, n) {
                        setTimeout(function () {
                            eve("raphael.anim.frame." + t, e, n)
                        })
                    }(f.id, f, r.anim)
                } else {
                    if (function (e, n, r) {
                        setTimeout(function () {
                            eve("raphael.anim.frame." + n.id, n, r), eve("raphael.anim.finish." + n.id, n, r), t.is(e, "function") && e.call(n)
                        })
                    }(r.callback, f, r.anim), f.attr(c), sn.splice(n--, 1), r.repeat > 1 && !r.next) {
                        for (a in c)c[k](a) && (d[a] = r.totalOrigin[a]);
                        r.el.attr(d), x(r.anim, r.el, r.anim.percents[0], null, r.totalOrigin, r.repeat - 1)
                    }
                    r.next && !r.stop && x(r.anim, r.el, r.next, null, r.totalOrigin, r.repeat)
                }
            }
        }
        t.svg && f && f.paper && f.paper.safari(), sn.length && on(un)
    }, ln = function (t) {
        return t > 255 ? 255 : 0 > t ? 0 : t
    };
    Ue.animateWith = function (e, n, r, i, a, s) {
        var o = this;
        if (o.removed)return s && s.call(o), o;
        var u = r instanceof g ? r : t.animation(r, i, a, s);
        x(u, o, u.percents[0], null, o.attr());
        for (var l = 0, h = sn.length; h > l; l++)if (sn[l].anim == n && sn[l].el == e) {
            sn[h - 1].start = sn[l].start;
            break
        }
        return o
    }, Ue.onAnimation = function (t) {
        return t ? eve.on("raphael.anim.frame." + this.id, t) : eve.unbind("raphael.anim.frame." + this.id), this
    }, g.prototype.delay = function (t) {
        var e = new g(this.anim, this.ms);
        return e.times = this.times, e.del = +t || 0, e
    }, g.prototype.repeat = function (t) {
        var e = new g(this.anim, this.ms);
        return e.del = this.del, e.times = j.floor(D(t, 0)) || 1, e
    }, t.animation = function (e, n, r, i) {
        if (e instanceof g)return e;
        (t.is(r, "function") || !r) && (i = i || r || null, r = null), e = Object(e), n = +n || 0;
        var a, s, o = {};
        for (s in e)e[k](s) && Q(s) != s && Q(s) + "%" != s && (a = !0, o[s] = e[s]);
        return a ? (r && (o.easing = r), i && (o.callback = i), new g({100: o}, n)) : new g(e, n)
    }, Ue.animate = function (e, n, r, i) {
        var a = this;
        if (a.removed)return i && i.call(a), a;
        var s = e instanceof g ? e : t.animation(e, n, r, i);
        return x(s, a, s.percents[0], null, a.attr()), a
    }, Ue.setTime = function (t, e) {
        return t && null != e && this.status(t, z(e, t.ms) / t.ms), this
    }, Ue.status = function (t, e) {
        var n, r, i = [], a = 0;
        if (null != e)return x(t, this, -1, z(e, 1)), this;
        for (n = sn.length; n > a; a++)if (r = sn[a], r.el.id == this.id && (!t || r.anim == t)) {
            if (t)return r.status;
            i.push({anim: r.anim, status: r.status})
        }
        return t ? 0 : i
    }, Ue.pause = function (t) {
        for (var e = 0; sn.length > e; e++)sn[e].el.id != this.id || t && sn[e].anim != t || eve("raphael.anim.pause." + this.id, this, sn[e].anim) !== !1 && (sn[e].paused = !0);
        return this
    }, Ue.resume = function (t) {
        for (var e = 0; sn.length > e; e++)if (sn[e].el.id == this.id && (!t || sn[e].anim == t)) {
            var n = sn[e];
            eve("raphael.anim.resume." + this.id, this, n.anim) !== !1 && (delete n.paused, this.status(n.anim, n.status))
        }
        return this
    }, Ue.stop = function (t) {
        for (var e = 0; sn.length > e; e++)sn[e].el.id != this.id || t && sn[e].anim != t || eve("raphael.anim.stop." + this.id, this, sn[e].anim) !== !1 && sn.splice(e--, 1);
        return this
    }, eve.on("raphael.remove", v), eve.on("raphael.clear", v), Ue.toString = function () {
        return"Raphaël’s object"
    };
    var hn = function (t) {
        if (this.items = [], this.length = 0, this.type = "set", t)for (var e = 0, n = t.length; n > e; e++)!t[e] || t[e].constructor != Ue.constructor && t[e].constructor != hn || (this[this.items.length] = this.items[this.items.length] = t[e], this.length++)
    }, cn = hn.prototype;
    cn.push = function () {
        for (var t, e, n = 0, r = arguments.length; r > n; n++)t = arguments[n], !t || t.constructor != Ue.constructor && t.constructor != hn || (e = this.items.length, this[e] = this.items[e] = t, this.length++);
        return this
    }, cn.pop = function () {
        return this.length && delete this[this.length--], this.items.pop()
    }, cn.forEach = function (t, e) {
        for (var n = 0, r = this.items.length; r > n; n++)if (t.call(e, this.items[n], n) === !1)return this;
        return this
    };
    for (var fn in Ue)Ue[k](fn) && (cn[fn] = function (t) {
        return function () {
            var e = arguments;
            return this.forEach(function (n) {
                n[t][F](n, e)
            })
        }
    }(fn));
    cn.attr = function (e, n) {
        if (e && t.is(e, N) && t.is(e[0], "object"))for (var r = 0, i = e.length; i > r; r++)this.items[r].attr(e[r]); else for (var a = 0, s = this.items.length; s > a; a++)this.items[a].attr(e, n);
        return this
    }, cn.clear = function () {
        for (; this.length;)this.pop()
    }, cn.splice = function (t, e) {
        t = 0 > t ? D(this.length + t, 0) : t, e = D(0, z(this.length - t, e));
        var n, r = [], i = [], a = [];
        for (n = 2; arguments.length > n; n++)a.push(arguments[n]);
        for (n = 0; e > n; n++)i.push(this[t + n]);
        for (; this.length - t > n; n++)r.push(this[t + n]);
        var s = a.length;
        for (n = 0; s + r.length > n; n++)this.items[t + n] = this[t + n] = s > n ? a[n] : r[n - s];
        for (n = this.items.length = this.length -= e - s; this[n];)delete this[n++];
        return new hn(i)
    }, cn.exclude = function (t) {
        for (var e = 0, n = this.length; n > e; e++)if (this[e] == t)return this.splice(e, 1), !0
    }, cn.animate = function (e, n, r, i) {
        (t.is(r, "function") || !r) && (i = r || null);
        var a, s, o = this.items.length, u = o, l = this;
        if (!o)return this;
        i && (s = function () {
            !--o && i.call(l)
        }), r = t.is(r, G) ? r : s;
        var h = t.animation(e, n, r, s);
        for (a = this.items[--u].animate(h); u--;)this.items[u] && !this.items[u].removed && this.items[u].animateWith(a, h, h);
        return this
    }, cn.insertAfter = function (t) {
        for (var e = this.items.length; e--;)this.items[e].insertAfter(t);
        return this
    }, cn.getBBox = function () {
        for (var t = [], e = [], n = [], r = [], i = this.items.length; i--;)if (!this.items[i].removed) {
            var a = this.items[i].getBBox();
            t.push(a.x), e.push(a.y), n.push(a.x + a.width), r.push(a.y + a.height)
        }
        return t = z[F](0, t), e = z[F](0, e), n = D[F](0, n), r = D[F](0, r), {x: t, y: e, x2: n, y2: r, width: n - t, height: r - e}
    }, cn.clone = function (t) {
        t = this.paper.set();
        for (var e = 0, n = this.items.length; n > e; e++)t.push(this.items[e].clone());
        return t
    }, cn.toString = function () {
        return"Raphaël‘s set"
    }, cn.glow = function (t) {
        var e = this.paper.set();
        return this.forEach(function (n) {
            var r = n.glow(t);
            null != r && r.forEach(function (t) {
                e.push(t)
            })
        }), e
    }, t.registerFont = function (t) {
        if (!t.face)return t;
        this.fonts = this.fonts || {};
        var e = {w: t.w, face: {}, glyphs: {}}, n = t.face["font-family"];
        for (var r in t.face)t.face[k](r) && (e.face[r] = t.face[r]);
        if (this.fonts[n] ? this.fonts[n].push(e) : this.fonts[n] = [e], !t.svg) {
            e.face["units-per-em"] = J(t.face["units-per-em"], 10);
            for (var i in t.glyphs)if (t.glyphs[k](i)) {
                var a = t.glyphs[i];
                if (e.glyphs[i] = {w: a.w, k: {}, d: a.d && "M" + a.d.replace(/[mlcxtrv]/g, function (t) {
                    return{l: "L", c: "C", x: "z", t: "m", r: "l", v: "c"}[t] || "M"
                }) + "z"}, a.k)for (var s in a.k)a[k](s) && (e.glyphs[i].k[s] = a.k[s])
            }
        }
        return t
    }, y.getFont = function (e, n, r, i) {
        if (i = i || "normal", r = r || "normal", n = +n || {normal: 400, bold: 700, lighter: 300, bolder: 800}[n] || 400, t.fonts) {
            var a = t.fonts[e];
            if (!a) {
                var s = RegExp("(^|\\s)" + e.replace(/[^\w\d\s+!~.:_-]/g, A) + "(\\s|$)", "i");
                for (var o in t.fonts)if (t.fonts[k](o) && s.test(o)) {
                    a = t.fonts[o];
                    break
                }
            }
            var u;
            if (a)for (var l = 0, h = a.length; h > l && (u = a[l], u.face["font-weight"] != n || u.face["font-style"] != r && u.face["font-style"] || u.face["font-stretch"] != i); l++);
            return u
        }
    }, y.print = function (e, n, r, i, a, s, o) {
        s = s || "middle", o = D(z(o || 0, 1), -1);
        var u, l = E(r)[M](A), h = 0, c = 0, f = A;
        if (t.is(i, "string") && (i = this.getFont(i)), i) {
            u = (a || 16) / i.face["units-per-em"];
            for (var p = i.face.bbox[M](b), d = +p[0], g = p[3] - p[1], x = 0, v = +p[1] + ("baseline" == s ? g + +i.face.descent : g / 2), m = 0, y = l.length; y > m; m++) {
                if ("\n" == l[m])h = 0, w = 0, c = 0, x += g; else {
                    var _ = c && i.glyphs[l[m - 1]] || {}, w = i.glyphs[l[m]];
                    h += c ? (_.w || i.w) + (_.k && _.k[l[m]] || 0) + i.w * o : 0, c = 1
                }
                w && w.d && (f += t.transformPath(w.d, ["t", h * u, x * u, "s", u, u, d, v, "t", (e - d) / u, (n - v) / u]))
            }
        }
        return this.path(f).attr({fill: "#000", stroke: "none"})
    }, y.add = function (e) {
        if (t.is(e, "array"))for (var n, r = this.set(), i = 0, a = e.length; a > i; i++)n = e[i] || {}, _[k](n.type) && r.push(this[n.type]().attr(n));
        return r
    }, t.format = function (e, n) {
        var r = t.is(n, N) ? [0][T](n) : arguments;
        return e && t.is(e, G) && r.length - 1 && (e = e.replace(w, function (t, e) {
            return null == r[++e] ? A : r[e]
        })), e || A
    }, t.fullfill = function () {
        var t = /\{([^\}]+)\}/g, e = /(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g, n = function (t, n, r) {
            var i = r;
            return n.replace(e, function (t, e, n, r, a) {
                e = e || r, i && (e in i && (i = i[e]), "function" == typeof i && a && (i = i()))
            }), i = (null == i || i == r ? t : i) + ""
        };
        return function (e, r) {
            return(e + "").replace(t, function (t, e) {
                return n(t, e, r)
            })
        }
    }(), t.ninja = function () {
        return S.was ? B.win.Raphael = S.is : delete Raphael, t
    }, t.st = cn, function (e, n, r) {
        function i() {
            /in/.test(e.readyState) ? setTimeout(i, 9) : t.eve("raphael.DOMload")
        }

        null == e.readyState && e.addEventListener && (e.addEventListener(n, r = function () {
            e.removeEventListener(n, r, !1), e.readyState = "complete"
        }, !1), e.readyState = "loading"), i()
    }(document, "DOMContentLoaded"), S.was ? B.win.Raphael = t : Raphael = t, eve.on("raphael.DOMload", function () {
        m = !0
    })
})();
window.Raphael && window.Raphael.svg && function (t) {
    var e = "hasOwnProperty", r = String, n = parseFloat, i = parseInt, a = Math, s = a.max, o = a.abs, u = a.pow, h = /[, ]+/, l = t.eve, c = "", f = " ", p = "http://www.w3.org/1999/xlink", d = {block: "M5,0 0,2.5 5,5z", classic: "M5,0 0,2.5 5,5 3.5,3 3.5,2z", diamond: "M2.5,0 5,2.5 2.5,5 0,2.5z", open: "M6,1 1,3.5 6,6", oval: "M2.5,0A2.5,2.5,0,0,1,2.5,5 2.5,2.5,0,0,1,2.5,0z"}, g = {};
    t.toString = function () {
        return"Your browser supports SVG.\nYou are running Raphaël " + this.version
    };
    var v = function (n, i) {
        if (i) {
            "string" == typeof n && (n = v(n));
            for (var a in i)i[e](a) && ("xlink:" == a.substring(0, 6) ? n.setAttributeNS(p, a.substring(6), r(i[a])) : n.setAttribute(a, r(i[a])))
        } else n = t._g.doc.createElementNS("http://www.w3.org/2000/svg", n), n.style && (n.style.webkitTapHighlightColor = "rgba(0,0,0,0)");
        return n
    }, x = function (e, i) {
        var h = "linear", l = e.id + i, f = .5, p = .5, d = e.node, g = e.paper, x = d.style, y = t._g.doc.getElementById(l);
        if (!y) {
            if (i = r(i).replace(t._radial_gradient, function (t, e, r) {
                if (h = "radial", e && r) {
                    f = n(e), p = n(r);
                    var i = 2 * (p > .5) - 1;
                    u(f - .5, 2) + u(p - .5, 2) > .25 && (p = a.sqrt(.25 - u(f - .5, 2)) * i + .5) && .5 != p && (p = p.toFixed(5) - 1e-5 * i)
                }
                return c
            }), i = i.split(/\s*\-\s*/), "linear" == h) {
                var m = i.shift();
                if (m = -n(m), isNaN(m))return null;
                var b = [0, 0, a.cos(t.rad(m)), a.sin(t.rad(m))], _ = 1 / (s(o(b[2]), o(b[3])) || 1);
                b[2] *= _, b[3] *= _, 0 > b[2] && (b[0] = -b[2], b[2] = 0), 0 > b[3] && (b[1] = -b[3], b[3] = 0)
            }
            var w = t._parseDots(i);
            if (!w)return null;
            if (l = l.replace(/[\(\)\s,\xb0#]/g, "_"), e.gradient && l != e.gradient.id && (g.defs.removeChild(e.gradient), delete e.gradient), !e.gradient) {
                y = v(h + "Gradient", {id: l}), e.gradient = y, v(y, "radial" == h ? {fx: f, fy: p} : {x1: b[0], y1: b[1], x2: b[2], y2: b[3], gradientTransform: e.matrix.invert()}), g.defs.appendChild(y);
                for (var k = 0, C = w.length; C > k; k++)y.appendChild(v("stop", {offset: w[k].offset ? w[k].offset : k ? "100%" : "0%", "stop-color": w[k].color || "#fff"}))
            }
        }
        return v(d, {fill: "url(#" + l + ")", opacity: 1, "fill-opacity": 1}), x.fill = c, x.opacity = 1, x.fillOpacity = 1, 1
    }, y = function (t) {
        var e = t.getBBox(1);
        v(t.pattern, {patternTransform: t.matrix.invert() + " translate(" + e.x + "," + e.y + ")"})
    }, m = function (n, i, a) {
        if ("path" == n.type) {
            for (var s, o, u, h, l, f = r(i).toLowerCase().split("-"), p = n.paper, x = a ? "end" : "start", y = n.node, m = n.attrs, b = m["stroke-width"], _ = f.length, w = "classic", k = 3, C = 3, B = 5; _--;)switch (f[_]) {
                case"block":
                case"classic":
                case"oval":
                case"diamond":
                case"open":
                case"none":
                    w = f[_];
                    break;
                case"wide":
                    C = 5;
                    break;
                case"narrow":
                    C = 2;
                    break;
                case"long":
                    k = 5;
                    break;
                case"short":
                    k = 2
            }
            if ("open" == w ? (k += 2, C += 2, B += 2, u = 1, h = a ? 4 : 1, l = {fill: "none", stroke: m.stroke}) : (h = u = k / 2, l = {fill: m.stroke, stroke: "none"}), n._.arrows ? a ? (n._.arrows.endPath && g[n._.arrows.endPath]--, n._.arrows.endMarker && g[n._.arrows.endMarker]--) : (n._.arrows.startPath && g[n._.arrows.startPath]--, n._.arrows.startMarker && g[n._.arrows.startMarker]--) : n._.arrows = {}, "none" != w) {
                var S = "raphael-marker-" + w, A = "raphael-marker-" + x + w + k + C;
                t._g.doc.getElementById(S) ? g[S]++ : (p.defs.appendChild(v(v("path"), {"stroke-linecap": "round", d: d[w], id: S})), g[S] = 1);
                var T, M = t._g.doc.getElementById(A);
                M ? (g[A]++, T = M.getElementsByTagName("use")[0]) : (M = v(v("marker"), {id: A, markerHeight: C, markerWidth: k, orient: "auto", refX: h, refY: C / 2}), T = v(v("use"), {"xlink:href": "#" + S, transform: (a ? "rotate(180 " + k / 2 + " " + C / 2 + ") " : c) + "scale(" + k / B + "," + C / B + ")", "stroke-width": (1 / ((k / B + C / B) / 2)).toFixed(4)}), M.appendChild(T), p.defs.appendChild(M), g[A] = 1), v(T, l);
                var F = u * ("diamond" != w && "oval" != w);
                a ? (s = n._.arrows.startdx * b || 0, o = t.getTotalLength(m.path) - F * b) : (s = F * b, o = t.getTotalLength(m.path) - (n._.arrows.enddx * b || 0)), l = {}, l["marker-" + x] = "url(#" + A + ")", (o || s) && (l.d = Raphael.getSubpath(m.path, s, o)), v(y, l), n._.arrows[x + "Path"] = S, n._.arrows[x + "Marker"] = A, n._.arrows[x + "dx"] = F, n._.arrows[x + "Type"] = w, n._.arrows[x + "String"] = i
            } else a ? (s = n._.arrows.startdx * b || 0, o = t.getTotalLength(m.path) - s) : (s = 0, o = t.getTotalLength(m.path) - (n._.arrows.enddx * b || 0)), n._.arrows[x + "Path"] && v(y, {d: Raphael.getSubpath(m.path, s, o)}), delete n._.arrows[x + "Path"], delete n._.arrows[x + "Marker"], delete n._.arrows[x + "dx"], delete n._.arrows[x + "Type"], delete n._.arrows[x + "String"];
            for (l in g)if (g[e](l) && !g[l]) {
                var L = t._g.doc.getElementById(l);
                L && L.parentNode.removeChild(L)
            }
        }
    }, b = {"": [0], none: [0], "-": [3, 1], ".": [1, 1], "-.": [3, 1, 1, 1], "-..": [3, 1, 1, 1, 1, 1], ". ": [1, 3], "- ": [4, 3], "--": [8, 3], "- .": [4, 3, 1, 3], "--.": [8, 3, 1, 3], "--..": [8, 3, 1, 3, 1, 3]}, _ = function (t, e, n) {
        if (e = b[r(e).toLowerCase()]) {
            for (var i = t.attrs["stroke-width"] || "1", a = {round: i, square: i, butt: 0}[t.attrs["stroke-linecap"] || n["stroke-linecap"]] || 0, s = [], o = e.length; o--;)s[o] = e[o] * i + (o % 2 ? 1 : -1) * a;
            v(t.node, {"stroke-dasharray": s.join(",")})
        }
    }, w = function (n, a) {
        var u = n.node, l = n.attrs, f = u.style.visibility;
        u.style.visibility = "hidden";
        for (var d in a)if (a[e](d)) {
            if (!t._availableAttrs[e](d))continue;
            var g = a[d];
            switch (l[d] = g, d) {
                case"blur":
                    n.blur(g);
                    break;
                case"href":
                case"title":
                case"target":
                    var b = u.parentNode;
                    if ("a" != b.tagName.toLowerCase()) {
                        var w = v("a");
                        b.insertBefore(w, u), w.appendChild(u), b = w
                    }
                    "target" == d ? b.setAttributeNS(p, "show", "blank" == g ? "new" : g) : b.setAttributeNS(p, d, g);
                    break;
                case"cursor":
                    u.style.cursor = g;
                    break;
                case"transform":
                    n.transform(g);
                    break;
                case"arrow-start":
                    m(n, g);
                    break;
                case"arrow-end":
                    m(n, g, 1);
                    break;
                case"clip-rect":
                    var k = r(g).split(h);
                    if (4 == k.length) {
                        n.clip && n.clip.parentNode.parentNode.removeChild(n.clip.parentNode);
                        var B = v("clipPath"), S = v("rect");
                        B.id = t.createUUID(), v(S, {x: k[0], y: k[1], width: k[2], height: k[3]}), B.appendChild(S), n.paper.defs.appendChild(B), v(u, {"clip-path": "url(#" + B.id + ")"}), n.clip = S
                    }
                    if (!g) {
                        var A = u.getAttribute("clip-path");
                        if (A) {
                            var T = t._g.doc.getElementById(A.replace(/(^url\(#|\)$)/g, c));
                            T && T.parentNode.removeChild(T), v(u, {"clip-path": c}), delete n.clip
                        }
                    }
                    break;
                case"path":
                    "path" == n.type && (v(u, {d: g ? l.path = t._pathToAbsolute(g) : "M0,0"}), n._.dirty = 1, n._.arrows && ("startString"in n._.arrows && m(n, n._.arrows.startString), "endString"in n._.arrows && m(n, n._.arrows.endString, 1)));
                    break;
                case"width":
                    if (u.setAttribute(d, g), n._.dirty = 1, !l.fx)break;
                    d = "x", g = l.x;
                case"x":
                    l.fx && (g = -l.x - (l.width || 0));
                case"rx":
                    if ("rx" == d && "rect" == n.type)break;
                case"cx":
                    u.setAttribute(d, g), n.pattern && y(n), n._.dirty = 1;
                    break;
                case"height":
                    if (u.setAttribute(d, g), n._.dirty = 1, !l.fy)break;
                    d = "y", g = l.y;
                case"y":
                    l.fy && (g = -l.y - (l.height || 0));
                case"ry":
                    if ("ry" == d && "rect" == n.type)break;
                case"cy":
                    u.setAttribute(d, g), n.pattern && y(n), n._.dirty = 1;
                    break;
                case"r":
                    "rect" == n.type ? v(u, {rx: g, ry: g}) : u.setAttribute(d, g), n._.dirty = 1;
                    break;
                case"src":
                    "image" == n.type && u.setAttributeNS(p, "href", g);
                    break;
                case"stroke-width":
                    (1 != n._.sx || 1 != n._.sy) && (g /= s(o(n._.sx), o(n._.sy)) || 1), n.paper._vbSize && (g *= n.paper._vbSize), u.setAttribute(d, g), l["stroke-dasharray"] && _(n, l["stroke-dasharray"], a), n._.arrows && ("startString"in n._.arrows && m(n, n._.arrows.startString), "endString"in n._.arrows && m(n, n._.arrows.endString, 1));
                    break;
                case"stroke-dasharray":
                    _(n, g, a);
                    break;
                case"fill":
                    var M = r(g).match(t._ISURL);
                    if (M) {
                        B = v("pattern");
                        var F = v("image");
                        B.id = t.createUUID(), v(B, {x: 0, y: 0, patternUnits: "userSpaceOnUse", height: 1, width: 1}), v(F, {x: 0, y: 0, "xlink:href": M[1]}), B.appendChild(F), function (e) {
                            t._preload(M[1], function () {
                                var t = this.offsetWidth, r = this.offsetHeight;
                                v(e, {width: t, height: r}), v(F, {width: t, height: r}), n.paper.safari()
                            })
                        }(B), n.paper.defs.appendChild(B), v(u, {fill: "url(#" + B.id + ")"}), n.pattern = B, n.pattern && y(n);
                        break
                    }
                    var L = t.getRGB(g);
                    if (L.error) {
                        if (("circle" == n.type || "ellipse" == n.type || "r" != r(g).charAt()) && x(n, g)) {
                            if ("opacity"in l || "fill-opacity"in l) {
                                var N = t._g.doc.getElementById(u.getAttribute("fill").replace(/^url\(#|\)$/g, c));
                                if (N) {
                                    var P = N.getElementsByTagName("stop");
                                    v(P[P.length - 1], {"stop-opacity": ("opacity"in l ? l.opacity : 1) * ("fill-opacity"in l ? l["fill-opacity"] : 1)})
                                }
                            }
                            l.gradient = g, l.fill = "none";
                            break
                        }
                    } else delete a.gradient, delete l.gradient, !t.is(l.opacity, "undefined") && t.is(a.opacity, "undefined") && v(u, {opacity: l.opacity}), !t.is(l["fill-opacity"], "undefined") && t.is(a["fill-opacity"], "undefined") && v(u, {"fill-opacity": l["fill-opacity"]});
                    L[e]("opacity") && v(u, {"fill-opacity": L.opacity > 1 ? L.opacity / 100 : L.opacity});
                case"stroke":
                    L = t.getRGB(g), u.setAttribute(d, L.hex), "stroke" == d && L[e]("opacity") && v(u, {"stroke-opacity": L.opacity > 1 ? L.opacity / 100 : L.opacity}), "stroke" == d && n._.arrows && ("startString"in n._.arrows && m(n, n._.arrows.startString), "endString"in n._.arrows && m(n, n._.arrows.endString, 1));
                    break;
                case"gradient":
                    ("circle" == n.type || "ellipse" == n.type || "r" != r(g).charAt()) && x(n, g);
                    break;
                case"opacity":
                    l.gradient && !l[e]("stroke-opacity") && v(u, {"stroke-opacity": g > 1 ? g / 100 : g});
                case"fill-opacity":
                    if (l.gradient) {
                        N = t._g.doc.getElementById(u.getAttribute("fill").replace(/^url\(#|\)$/g, c)), N && (P = N.getElementsByTagName("stop"), v(P[P.length - 1], {"stop-opacity": g}));
                        break
                    }
                default:
                    "font-size" == d && (g = i(g, 10) + "px");
                    var E = d.replace(/(\-.)/g, function (t) {
                        return t.substring(1).toUpperCase()
                    });
                    u.style[E] = g, n._.dirty = 1, u.setAttribute(d, g)
            }
        }
        C(n, a), u.style.visibility = f
    }, k = 1.2, C = function (n, a) {
        if ("text" == n.type && (a[e]("text") || a[e]("font") || a[e]("font-size") || a[e]("x") || a[e]("y"))) {
            var s = n.attrs, o = n.node, u = o.firstChild ? i(t._g.doc.defaultView.getComputedStyle(o.firstChild, c).getPropertyValue("font-size"), 10) : 10;
            if (a[e]("text")) {
                for (s.text = a.text; o.firstChild;)o.removeChild(o.firstChild);
                for (var h, l = r(a.text).split("\n"), f = [], p = 0, d = l.length; d > p; p++)h = v("tspan"), p && v(h, {dy: u * k, x: s.x}), h.appendChild(t._g.doc.createTextNode(l[p])), o.appendChild(h), f[p] = h
            } else for (f = o.getElementsByTagName("tspan"), p = 0, d = f.length; d > p; p++)p ? v(f[p], {dy: u * k, x: s.x}) : v(f[0], {dy: 0});
            v(o, {x: s.x, y: s.y}), n._.dirty = 1;
            var g = n._getBBox(), x = s.y - (g.y + g.height / 2);
            x && t.is(x, "finite") && v(f[0], {dy: x})
        }
    }, B = function (e, r) {
        this[0] = this.node = e, e.raphael = !0, this.id = t._oid++, e.raphaelid = this.id, this.matrix = t.matrix(), this.realPath = null, this.paper = r, this.attrs = this.attrs || {}, this._ = {transform: [], sx: 1, sy: 1, deg: 0, dx: 0, dy: 0, dirty: 1}, !r.bottom && (r.bottom = this), this.prev = r.top, r.top && (r.top.next = this), r.top = this, this.next = null
    }, S = t.el;
    B.prototype = S, S.constructor = B, t._engine.path = function (t, e) {
        var r = v("path");
        e.canvas && e.canvas.appendChild(r);
        var n = new B(r, e);
        return n.type = "path", w(n, {fill: "none", stroke: "#000", path: t}), n
    }, S.rotate = function (t, e, i) {
        if (this.removed)return this;
        if (t = r(t).split(h), t.length - 1 && (e = n(t[1]), i = n(t[2])), t = n(t[0]), null == i && (e = i), null == e || null == i) {
            var a = this.getBBox(1);
            e = a.x + a.width / 2, i = a.y + a.height / 2
        }
        return this.transform(this._.transform.concat([
            ["r", t, e, i]
        ])), this
    }, S.scale = function (t, e, i, a) {
        if (this.removed)return this;
        if (t = r(t).split(h), t.length - 1 && (e = n(t[1]), i = n(t[2]), a = n(t[3])), t = n(t[0]), null == e && (e = t), null == a && (i = a), null == i || null == a)var s = this.getBBox(1);
        return i = null == i ? s.x + s.width / 2 : i, a = null == a ? s.y + s.height / 2 : a, this.transform(this._.transform.concat([
            ["s", t, e, i, a]
        ])), this
    }, S.translate = function (t, e) {
        return this.removed ? this : (t = r(t).split(h), t.length - 1 && (e = n(t[1])), t = n(t[0]) || 0, e = +e || 0, this.transform(this._.transform.concat([
            ["t", t, e]
        ])), this)
    }, S.transform = function (r) {
        var n = this._;
        if (null == r)return n.transform;
        if (t._extractTransform(this, r), this.clip && v(this.clip, {transform: this.matrix.invert()}), this.pattern && y(this), this.node && v(this.node, {transform: this.matrix}), 1 != n.sx || 1 != n.sy) {
            var i = this.attrs[e]("stroke-width") ? this.attrs["stroke-width"] : 1;
            this.attr({"stroke-width": i})
        }
        return this
    }, S.hide = function () {
        return!this.removed && this.paper.safari(this.node.style.display = "none"), this
    }, S.show = function () {
        return!this.removed && this.paper.safari(this.node.style.display = ""), this
    }, S.remove = function () {
        if (!this.removed && this.node.parentNode) {
            var e = this.paper;
            e.__set__ && e.__set__.exclude(this), l.unbind("raphael.*.*." + this.id), this.gradient && e.defs.removeChild(this.gradient), t._tear(this, e), "a" == this.node.parentNode.tagName.toLowerCase() ? this.node.parentNode.parentNode.removeChild(this.node.parentNode) : this.node.parentNode.removeChild(this.node);
            for (var r in this)this[r] = "function" == typeof this[r] ? t._removedFactory(r) : null;
            this.removed = !0
        }
    }, S._getBBox = function () {
        if ("none" == this.node.style.display) {
            this.show();
            var t = !0
        }
        var e = {};
        try {
            e = this.node.getBBox()
        } catch (r) {
        } finally {
            e = e || {}
        }
        return t && this.hide(), e
    }, S.attr = function (r, n) {
        if (this.removed)return this;
        if (null == r) {
            var i = {};
            for (var a in this.attrs)this.attrs[e](a) && (i[a] = this.attrs[a]);
            return i.gradient && "none" == i.fill && (i.fill = i.gradient) && delete i.gradient, i.transform = this._.transform, i
        }
        if (null == n && t.is(r, "string")) {
            if ("fill" == r && "none" == this.attrs.fill && this.attrs.gradient)return this.attrs.gradient;
            if ("transform" == r)return this._.transform;
            for (var s = r.split(h), o = {}, u = 0, c = s.length; c > u; u++)r = s[u], o[r] = r in this.attrs ? this.attrs[r] : t.is(this.paper.customAttributes[r], "function") ? this.paper.customAttributes[r].def : t._availableAttrs[r];
            return c - 1 ? o : o[s[0]]
        }
        if (null == n && t.is(r, "array")) {
            for (o = {}, u = 0, c = r.length; c > u; u++)o[r[u]] = this.attr(r[u]);
            return o
        }
        if (null != n) {
            var f = {};
            f[r] = n
        } else null != r && t.is(r, "object") && (f = r);
        for (var p in f)l("raphael.attr." + p + "." + this.id, this, f[p]);
        for (p in this.paper.customAttributes)if (this.paper.customAttributes[e](p) && f[e](p) && t.is(this.paper.customAttributes[p], "function")) {
            var d = this.paper.customAttributes[p].apply(this, [].concat(f[p]));
            this.attrs[p] = f[p];
            for (var g in d)d[e](g) && (f[g] = d[g])
        }
        return w(this, f), this
    }, S.toFront = function () {
        if (this.removed)return this;
        "a" == this.node.parentNode.tagName.toLowerCase() ? this.node.parentNode.parentNode.appendChild(this.node.parentNode) : this.node.parentNode.appendChild(this.node);
        var e = this.paper;
        return e.top != this && t._tofront(this, e), this
    }, S.toBack = function () {
        if (this.removed)return this;
        var e = this.node.parentNode;
        return"a" == e.tagName.toLowerCase() ? e.parentNode.insertBefore(this.node.parentNode, this.node.parentNode.parentNode.firstChild) : e.firstChild != this.node && e.insertBefore(this.node, this.node.parentNode.firstChild), t._toback(this, this.paper), this.paper, this
    }, S.insertAfter = function (e) {
        if (this.removed)return this;
        var r = e.node || e[e.length - 1].node;
        return r.nextSibling ? r.parentNode.insertBefore(this.node, r.nextSibling) : r.parentNode.appendChild(this.node), t._insertafter(this, e, this.paper), this
    }, S.insertBefore = function (e) {
        if (this.removed)return this;
        var r = e.node || e[0].node;
        return r.parentNode.insertBefore(this.node, r), t._insertbefore(this, e, this.paper), this
    }, S.blur = function (e) {
        var r = this;
        if (0 !== +e) {
            var n = v("filter"), i = v("feGaussianBlur");
            r.attrs.blur = e, n.id = t.createUUID(), v(i, {stdDeviation: +e || 1.5}), n.appendChild(i), r.paper.defs.appendChild(n), r._blur = n, v(r.node, {filter: "url(#" + n.id + ")"})
        } else r._blur && (r._blur.parentNode.removeChild(r._blur), delete r._blur, delete r.attrs.blur), r.node.removeAttribute("filter")
    }, t._engine.circle = function (t, e, r, n) {
        var i = v("circle");
        t.canvas && t.canvas.appendChild(i);
        var a = new B(i, t);
        return a.attrs = {cx: e, cy: r, r: n, fill: "none", stroke: "#000"}, a.type = "circle", v(i, a.attrs), a
    }, t._engine.rect = function (t, e, r, n, i, a) {
        var s = v("rect");
        t.canvas && t.canvas.appendChild(s);
        var o = new B(s, t);
        return o.attrs = {x: e, y: r, width: n, height: i, r: a || 0, rx: a || 0, ry: a || 0, fill: "none", stroke: "#000"}, o.type = "rect", v(s, o.attrs), o
    }, t._engine.ellipse = function (t, e, r, n, i) {
        var a = v("ellipse");
        t.canvas && t.canvas.appendChild(a);
        var s = new B(a, t);
        return s.attrs = {cx: e, cy: r, rx: n, ry: i, fill: "none", stroke: "#000"}, s.type = "ellipse", v(a, s.attrs), s
    }, t._engine.image = function (t, e, r, n, i, a) {
        var s = v("image");
        v(s, {x: r, y: n, width: i, height: a, preserveAspectRatio: "none"}), s.setAttributeNS(p, "href", e), t.canvas && t.canvas.appendChild(s);
        var o = new B(s, t);
        return o.attrs = {x: r, y: n, width: i, height: a, src: e}, o.type = "image", o
    }, t._engine.text = function (e, r, n, i) {
        var a = v("text");
        e.canvas && e.canvas.appendChild(a);
        var s = new B(a, e);
        return s.attrs = {x: r, y: n, "text-anchor": "middle", text: i, font: t._availableAttrs.font, stroke: "none", fill: "#000"}, s.type = "text", w(s, s.attrs), s
    }, t._engine.setSize = function (t, e) {
        return this.width = t || this.width, this.height = e || this.height, this.canvas.setAttribute("width", this.width), this.canvas.setAttribute("height", this.height), this._viewBox && this.setViewBox.apply(this, this._viewBox), this
    }, t._engine.create = function () {
        var e = t._getContainer.apply(0, arguments), r = e && e.container, n = e.x, i = e.y, a = e.width, s = e.height;
        if (!r)throw Error("SVG container not found.");
        var o, u = v("svg"), h = "overflow:hidden;";
        return n = n || 0, i = i || 0, a = a || 512, s = s || 342, v(u, {height: s, version: 1.1, width: a, xmlns: "http://www.w3.org/2000/svg"}), 1 == r ? (u.style.cssText = h + "position:absolute;left:" + n + "px;top:" + i + "px", t._g.doc.body.appendChild(u), o = 1) : (u.style.cssText = h + "position:relative", r.firstChild ? r.insertBefore(u, r.firstChild) : r.appendChild(u)), r = new t._Paper, r.width = a, r.height = s, r.canvas = u, r.clear(), r._left = r._top = 0, o && (r.renderfix = function () {
        }), r.renderfix(), r
    }, t._engine.setViewBox = function (t, e, r, n, i) {
        l("raphael.setViewBox", this, this._viewBox, [t, e, r, n, i]);
        var a, o, u = s(r / this.width, n / this.height), h = this.top, c = i ? "meet" : "xMinYMin";
        for (null == t ? (this._vbSize && (u = 1), delete this._vbSize, a = "0 0 " + this.width + f + this.height) : (this._vbSize = u, a = t + f + e + f + r + f + n), v(this.canvas, {viewBox: a, preserveAspectRatio: c}); u && h;)o = "stroke-width"in h.attrs ? h.attrs["stroke-width"] : 1, h.attr({"stroke-width": o}), h._.dirty = 1, h._.dirtyT = 1, h = h.prev;
        return this._viewBox = [t, e, r, n, !!i], this
    }, t.prototype.renderfix = function () {
        var t, e = this.canvas, r = e.style;
        try {
            t = e.getScreenCTM() || e.createSVGMatrix()
        } catch (n) {
            t = e.createSVGMatrix()
        }
        var i = -t.e % 1, a = -t.f % 1;
        (i || a) && (i && (this._left = (this._left + i) % 1, r.left = this._left + "px"), a && (this._top = (this._top + a) % 1, r.top = this._top + "px"))
    }, t.prototype.clear = function () {
        t.eve("raphael.clear", this);
        for (var e = this.canvas; e.firstChild;)e.removeChild(e.firstChild);
        this.bottom = this.top = null, (this.desc = v("desc")).appendChild(t._g.doc.createTextNode("Created with Raphaël " + t.version)), e.appendChild(this.desc), e.appendChild(this.defs = v("defs"))
    }, t.prototype.remove = function () {
        l("raphael.remove", this), this.canvas.parentNode && this.canvas.parentNode.removeChild(this.canvas);
        for (var e in this)this[e] = "function" == typeof this[e] ? t._removedFactory(e) : null
    };
    var A = t.st;
    for (var T in S)S[e](T) && !A[e](T) && (A[T] = function (t) {
        return function () {
            var e = arguments;
            return this.forEach(function (r) {
                r[t].apply(r, e)
            })
        }
    }(T))
}(window.Raphael);
window.Raphael && window.Raphael.vml && function (t) {
    var e = "hasOwnProperty", r = String, i = parseFloat, n = Math, a = n.round, s = n.max, o = n.min, l = n.abs, h = "fill", u = /[, ]+/, c = t.eve, f = " progid:DXImageTransform.Microsoft", p = " ", d = "", g = {M: "m", L: "l", C: "c", Z: "x", m: "t", l: "r", c: "v", z: "x"}, v = /([clmz]),?([^clmz]*)/gi, x = / progid:\S+Blur\([^\)]+\)/g, y = /-?[^,\s-]+/g, m = "position:absolute;left:0;top:0;width:1px;height:1px", b = 21600, _ = {path: 1, rect: 1, image: 1}, w = {circle: 1, ellipse: 1}, k = function (e) {
        var i = /[ahqstv]/gi, n = t._pathToAbsolute;
        if (r(e).match(i) && (n = t._path2curve), i = /[clmz]/g, n == t._pathToAbsolute && !r(e).match(i)) {
            var s = r(e).replace(v, function (t, e, r) {
                var i = [], n = "m" == e.toLowerCase(), s = g[e];
                return r.replace(y, function (t) {
                    n && 2 == i.length && (s += i + g["m" == e ? "l" : "L"], i = []), i.push(a(t * b))
                }), s + i
            });
            return s
        }
        var o, l, h = n(e);
        s = [];
        for (var u = 0, c = h.length; c > u; u++) {
            o = h[u], l = h[u][0].toLowerCase(), "z" == l && (l = "x");
            for (var f = 1, x = o.length; x > f; f++)l += a(o[f] * b) + (f != x - 1 ? "," : d);
            s.push(l)
        }
        return s.join(p)
    }, C = function (e, r, i) {
        var n = t.matrix();
        return n.rotate(-e, .5, .5), {dx: n.x(r, i), dy: n.y(r, i)}
    }, B = function (t, e, r, i, n, a) {
        var s = t._, o = t.matrix, u = s.fillpos, c = t.node, f = c.style, d = 1, g = "", v = b / e, x = b / r;
        if (f.visibility = "hidden", e && r) {
            if (c.coordsize = l(v) + p + l(x), f.rotation = a * (0 > e * r ? -1 : 1), a) {
                var y = C(a, i, n);
                i = y.dx, n = y.dy
            }
            if (0 > e && (g += "x"), 0 > r && (g += " y") && (d = -1), f.flip = g, c.coordorigin = i * -v + p + n * -x, u || s.fillsize) {
                var m = c.getElementsByTagName(h);
                m = m && m[0], c.removeChild(m), u && (y = C(a, o.x(u[0], u[1]), o.y(u[0], u[1])), m.position = y.dx * d + p + y.dy * d), s.fillsize && (m.size = s.fillsize[0] * l(e) + p + s.fillsize[1] * l(r)), c.appendChild(m)
            }
            f.visibility = "visible"
        }
    };
    t.toString = function () {
        return"Your browser doesn’t support SVG. Falling down to VML.\nYou are running Raphaël " + this.version
    };
    var S = function (t, e, i) {
        for (var n = r(e).toLowerCase().split("-"), a = i ? "end" : "start", s = n.length, o = "classic", l = "medium", h = "medium"; s--;)switch (n[s]) {
            case"block":
            case"classic":
            case"oval":
            case"diamond":
            case"open":
            case"none":
                o = n[s];
                break;
            case"wide":
            case"narrow":
                h = n[s];
                break;
            case"long":
            case"short":
                l = n[s]
        }
        var u = t.node.getElementsByTagName("stroke")[0];
        u[a + "arrow"] = o, u[a + "arrowlength"] = l, u[a + "arrowwidth"] = h
    }, A = function (n, l) {
        n.attrs = n.attrs || {};
        var c = n.node, f = n.attrs, g = c.style, v = _[n.type] && (l.x != f.x || l.y != f.y || l.width != f.width || l.height != f.height || l.cx != f.cx || l.cy != f.cy || l.rx != f.rx || l.ry != f.ry || l.r != f.r), x = w[n.type] && (f.cx != l.cx || f.cy != l.cy || f.r != l.r || f.rx != l.rx || f.ry != l.ry), y = n;
        for (var m in l)l[e](m) && (f[m] = l[m]);
        if (v && (f.path = t._getPath[n.type](n), n._.dirty = 1), l.href && (c.href = l.href), l.title && (c.title = l.title), l.target && (c.target = l.target), l.cursor && (g.cursor = l.cursor), "blur"in l && n.blur(l.blur), (l.path && "path" == n.type || v) && (c.path = k(~r(f.path).toLowerCase().indexOf("r") ? t._pathToAbsolute(f.path) : f.path), "image" == n.type && (n._.fillpos = [f.x, f.y], n._.fillsize = [f.width, f.height], B(n, 1, 1, 0, 0, 0))), "transform"in l && n.transform(l.transform), x) {
            var C = +f.cx, A = +f.cy, N = +f.rx || +f.r || 0, E = +f.ry || +f.r || 0;
            c.path = t.format("ar{0},{1},{2},{3},{4},{1},{4},{1}x", a((C - N) * b), a((A - E) * b), a((C + N) * b), a((A + E) * b), a(C * b))
        }
        if ("clip-rect"in l) {
            var M = r(l["clip-rect"]).split(u);
            if (4 == M.length) {
                M[2] = +M[2] + +M[0], M[3] = +M[3] + +M[1];
                var z = c.clipRect || t._g.doc.createElement("div"), F = z.style;
                F.clip = t.format("rect({1}px {2}px {3}px {0}px)", M), c.clipRect || (F.position = "absolute", F.top = 0, F.left = 0, F.width = n.paper.width + "px", F.height = n.paper.height + "px", c.parentNode.insertBefore(z, c), z.appendChild(c), c.clipRect = z)
            }
            l["clip-rect"] || c.clipRect && (c.clipRect.style.clip = "auto")
        }
        if (n.textpath) {
            var R = n.textpath.style;
            l.font && (R.font = l.font), l["font-family"] && (R.fontFamily = '"' + l["font-family"].split(",")[0].replace(/^['"]+|['"]+$/g, d) + '"'), l["font-size"] && (R.fontSize = l["font-size"]), l["font-weight"] && (R.fontWeight = l["font-weight"]), l["font-style"] && (R.fontStyle = l["font-style"])
        }
        if ("arrow-start"in l && S(y, l["arrow-start"]), "arrow-end"in l && S(y, l["arrow-end"], 1), null != l.opacity || null != l["stroke-width"] || null != l.fill || null != l.src || null != l.stroke || null != l["stroke-width"] || null != l["stroke-opacity"] || null != l["fill-opacity"] || null != l["stroke-dasharray"] || null != l["stroke-miterlimit"] || null != l["stroke-linejoin"] || null != l["stroke-linecap"]) {
            var P = c.getElementsByTagName(h), I = !1;
            if (P = P && P[0], !P && (I = P = L(h)), "image" == n.type && l.src && (P.src = l.src), l.fill && (P.on = !0), (null == P.on || "none" == l.fill || null === l.fill) && (P.on = !1), P.on && l.fill) {
                var j = r(l.fill).match(t._ISURL);
                if (j) {
                    P.parentNode == c && c.removeChild(P), P.rotate = !0, P.src = j[1], P.type = "tile";
                    var q = n.getBBox(1);
                    P.position = q.x + p + q.y, n._.fillpos = [q.x, q.y], t._preload(j[1], function () {
                        n._.fillsize = [this.offsetWidth, this.offsetHeight]
                    })
                } else P.color = t.getRGB(l.fill).hex, P.src = d, P.type = "solid", t.getRGB(l.fill).error && (y.type in{circle: 1, ellipse: 1} || "r" != r(l.fill).charAt()) && T(y, l.fill, P) && (f.fill = "none", f.gradient = l.fill, P.rotate = !1)
            }
            if ("fill-opacity"in l || "opacity"in l) {
                var D = ((+f["fill-opacity"] + 1 || 2) - 1) * ((+f.opacity + 1 || 2) - 1) * ((+t.getRGB(l.fill).o + 1 || 2) - 1);
                D = o(s(D, 0), 1), P.opacity = D, P.src && (P.color = "none")
            }
            c.appendChild(P);
            var O = c.getElementsByTagName("stroke") && c.getElementsByTagName("stroke")[0], V = !1;
            !O && (V = O = L("stroke")), (l.stroke && "none" != l.stroke || l["stroke-width"] || null != l["stroke-opacity"] || l["stroke-dasharray"] || l["stroke-miterlimit"] || l["stroke-linejoin"] || l["stroke-linecap"]) && (O.on = !0), ("none" == l.stroke || null === l.stroke || null == O.on || 0 == l.stroke || 0 == l["stroke-width"]) && (O.on = !1);
            var Y = t.getRGB(l.stroke);
            O.on && l.stroke && (O.color = Y.hex), D = ((+f["stroke-opacity"] + 1 || 2) - 1) * ((+f.opacity + 1 || 2) - 1) * ((+Y.o + 1 || 2) - 1);
            var G = .75 * (i(l["stroke-width"]) || 1);
            if (D = o(s(D, 0), 1), null == l["stroke-width"] && (G = f["stroke-width"]), l["stroke-width"] && (O.weight = G), G && 1 > G && (D *= G) && (O.weight = 1), O.opacity = D, l["stroke-linejoin"] && (O.joinstyle = l["stroke-linejoin"] || "miter"), O.miterlimit = l["stroke-miterlimit"] || 8, l["stroke-linecap"] && (O.endcap = "butt" == l["stroke-linecap"] ? "flat" : "square" == l["stroke-linecap"] ? "square" : "round"), l["stroke-dasharray"]) {
                var W = {"-": "shortdash", ".": "shortdot", "-.": "shortdashdot", "-..": "shortdashdotdot", ". ": "dot", "- ": "dash", "--": "longdash", "- .": "dashdot", "--.": "longdashdot", "--..": "longdashdotdot"};
                O.dashstyle = W[e](l["stroke-dasharray"]) ? W[l["stroke-dasharray"]] : d
            }
            V && c.appendChild(O)
        }
        if ("text" == y.type) {
            y.paper.canvas.style.display = d;
            var X = y.paper.span, H = 100, U = f.font && f.font.match(/\d+(?:\.\d*)?(?=px)/);
            g = X.style, f.font && (g.font = f.font), f["font-family"] && (g.fontFamily = f["font-family"]), f["font-weight"] && (g.fontWeight = f["font-weight"]), f["font-style"] && (g.fontStyle = f["font-style"]), U = i(f["font-size"] || U && U[0]) || 10, g.fontSize = U * H + "px", y.textpath.string && (X.innerHTML = r(y.textpath.string).replace(/</g, "&#60;").replace(/&/g, "&#38;").replace(/\n/g, "<br>"));
            var $ = X.getBoundingClientRect();
            y.W = f.w = ($.right - $.left) / H, y.H = f.h = ($.bottom - $.top) / H, y.X = f.x, y.Y = f.y + y.H / 2, ("x"in l || "y"in l) && (y.path.v = t.format("m{0},{1}l{2},{1}", a(f.x * b), a(f.y * b), a(f.x * b) + 1));
            for (var Z = ["x", "y", "text", "font", "font-family", "font-weight", "font-style", "font-size"], Q = 0, J = Z.length; J > Q; Q++)if (Z[Q]in l) {
                y._.dirty = 1;
                break
            }
            switch (f["text-anchor"]) {
                case"start":
                    y.textpath.style["v-text-align"] = "left", y.bbx = y.W / 2;
                    break;
                case"end":
                    y.textpath.style["v-text-align"] = "right", y.bbx = -y.W / 2;
                    break;
                default:
                    y.textpath.style["v-text-align"] = "center", y.bbx = 0
            }
            y.textpath.style["v-text-kern"] = !0
        }
    }, T = function (e, a, s) {
        e.attrs = e.attrs || {};
        var o = (e.attrs, Math.pow), l = "linear", h = ".5 .5";
        if (e.attrs.gradient = a, a = r(a).replace(t._radial_gradient, function (t, e, r) {
            return l = "radial", e && r && (e = i(e), r = i(r), o(e - .5, 2) + o(r - .5, 2) > .25 && (r = n.sqrt(.25 - o(e - .5, 2)) * (2 * (r > .5) - 1) + .5), h = e + p + r), d
        }), a = a.split(/\s*\-\s*/), "linear" == l) {
            var u = a.shift();
            if (u = -i(u), isNaN(u))return null
        }
        var c = t._parseDots(a);
        if (!c)return null;
        if (e = e.shape || e.node, c.length) {
            e.removeChild(s), s.on = !0, s.method = "none", s.color = c[0].color, s.color2 = c[c.length - 1].color;
            for (var f = [], g = 0, v = c.length; v > g; g++)c[g].offset && f.push(c[g].offset + p + c[g].color);
            s.colors = f.length ? f.join() : "0% " + s.color, "radial" == l ? (s.type = "gradientTitle", s.focus = "100%", s.focussize = "0 0", s.focusposition = h, s.angle = 0) : (s.type = "gradient", s.angle = (270 - u) % 360), e.appendChild(s)
        }
        return 1
    }, N = function (e, r) {
        this[0] = this.node = e, e.raphael = !0, this.id = t._oid++, e.raphaelid = this.id, this.X = 0, this.Y = 0, this.attrs = {}, this.paper = r, this.matrix = t.matrix(), this._ = {transform: [], sx: 1, sy: 1, dx: 0, dy: 0, deg: 0, dirty: 1, dirtyT: 1}, !r.bottom && (r.bottom = this), this.prev = r.top, r.top && (r.top.next = this), r.top = this, this.next = null
    }, E = t.el;
    N.prototype = E, E.constructor = N, E.transform = function (e) {
        if (null == e)return this._.transform;
        var i, n = this.paper._viewBoxShift, a = n ? "s" + [n.scale, n.scale] + "-1-1t" + [n.dx, n.dy] : d;
        n && (i = e = r(e).replace(/\.{3}|\u2026/g, this._.transform || d)), t._extractTransform(this, a + e);
        var s, o = this.matrix.clone(), l = this.skew, h = this.node, u = ~r(this.attrs.fill).indexOf("-"), c = !r(this.attrs.fill).indexOf("url(");
        if (o.translate(-.5, -.5), c || u || "image" == this.type)if (l.matrix = "1 0 0 1", l.offset = "0 0", s = o.split(), u && s.noRotation || !s.isSimple) {
            h.style.filter = o.toFilter();
            var f = this.getBBox(), g = this.getBBox(1), v = f.x - g.x, x = f.y - g.y;
            h.coordorigin = v * -b + p + x * -b, B(this, 1, 1, v, x, 0)
        } else h.style.filter = d, B(this, s.scalex, s.scaley, s.dx, s.dy, s.rotate); else h.style.filter = d, l.matrix = r(o), l.offset = o.offset();
        return i && (this._.transform = i), this
    }, E.rotate = function (t, e, n) {
        if (this.removed)return this;
        if (null != t) {
            if (t = r(t).split(u), t.length - 1 && (e = i(t[1]), n = i(t[2])), t = i(t[0]), null == n && (e = n), null == e || null == n) {
                var a = this.getBBox(1);
                e = a.x + a.width / 2, n = a.y + a.height / 2
            }
            return this._.dirtyT = 1, this.transform(this._.transform.concat([
                ["r", t, e, n]
            ])), this
        }
    }, E.translate = function (t, e) {
        return this.removed ? this : (t = r(t).split(u), t.length - 1 && (e = i(t[1])), t = i(t[0]) || 0, e = +e || 0, this._.bbox && (this._.bbox.x += t, this._.bbox.y += e), this.transform(this._.transform.concat([
            ["t", t, e]
        ])), this)
    }, E.scale = function (t, e, n, a) {
        if (this.removed)return this;
        if (t = r(t).split(u), t.length - 1 && (e = i(t[1]), n = i(t[2]), a = i(t[3]), isNaN(n) && (n = null), isNaN(a) && (a = null)), t = i(t[0]), null == e && (e = t), null == a && (n = a), null == n || null == a)var s = this.getBBox(1);
        return n = null == n ? s.x + s.width / 2 : n, a = null == a ? s.y + s.height / 2 : a, this.transform(this._.transform.concat([
            ["s", t, e, n, a]
        ])), this._.dirtyT = 1, this
    }, E.hide = function () {
        return!this.removed && (this.node.style.display = "none"), this
    }, E.show = function () {
        return!this.removed && (this.node.style.display = d), this
    }, E._getBBox = function () {
        return this.removed ? {} : {x: this.X + (this.bbx || 0) - this.W / 2, y: this.Y - this.H, width: this.W, height: this.H}
    }, E.remove = function () {
        if (!this.removed && this.node.parentNode) {
            this.paper.__set__ && this.paper.__set__.exclude(this), t.eve.unbind("raphael.*.*." + this.id), t._tear(this, this.paper), this.node.parentNode.removeChild(this.node), this.shape && this.shape.parentNode.removeChild(this.shape);
            for (var e in this)this[e] = "function" == typeof this[e] ? t._removedFactory(e) : null;
            this.removed = !0
        }
    }, E.attr = function (r, i) {
        if (this.removed)return this;
        if (null == r) {
            var n = {};
            for (var a in this.attrs)this.attrs[e](a) && (n[a] = this.attrs[a]);
            return n.gradient && "none" == n.fill && (n.fill = n.gradient) && delete n.gradient, n.transform = this._.transform, n
        }
        if (null == i && t.is(r, "string")) {
            if (r == h && "none" == this.attrs.fill && this.attrs.gradient)return this.attrs.gradient;
            for (var s = r.split(u), o = {}, l = 0, f = s.length; f > l; l++)r = s[l], o[r] = r in this.attrs ? this.attrs[r] : t.is(this.paper.customAttributes[r], "function") ? this.paper.customAttributes[r].def : t._availableAttrs[r];
            return f - 1 ? o : o[s[0]]
        }
        if (this.attrs && null == i && t.is(r, "array")) {
            for (o = {}, l = 0, f = r.length; f > l; l++)o[r[l]] = this.attr(r[l]);
            return o
        }
        var p;
        null != i && (p = {}, p[r] = i), null == i && t.is(r, "object") && (p = r);
        for (var d in p)c("raphael.attr." + d + "." + this.id, this, p[d]);
        if (p) {
            for (d in this.paper.customAttributes)if (this.paper.customAttributes[e](d) && p[e](d) && t.is(this.paper.customAttributes[d], "function")) {
                var g = this.paper.customAttributes[d].apply(this, [].concat(p[d]));
                this.attrs[d] = p[d];
                for (var v in g)g[e](v) && (p[v] = g[v])
            }
            p.text && "text" == this.type && (this.textpath.string = p.text), A(this, p)
        }
        return this
    }, E.toFront = function () {
        return!this.removed && this.node.parentNode.appendChild(this.node), this.paper && this.paper.top != this && t._tofront(this, this.paper), this
    }, E.toBack = function () {
        return this.removed ? this : (this.node.parentNode.firstChild != this.node && (this.node.parentNode.insertBefore(this.node, this.node.parentNode.firstChild), t._toback(this, this.paper)), this)
    }, E.insertAfter = function (e) {
        return this.removed ? this : (e.constructor == t.st.constructor && (e = e[e.length - 1]), e.node.nextSibling ? e.node.parentNode.insertBefore(this.node, e.node.nextSibling) : e.node.parentNode.appendChild(this.node), t._insertafter(this, e, this.paper), this)
    }, E.insertBefore = function (e) {
        return this.removed ? this : (e.constructor == t.st.constructor && (e = e[0]), e.node.parentNode.insertBefore(this.node, e.node), t._insertbefore(this, e, this.paper), this)
    }, E.blur = function (e) {
        var r = this.node.runtimeStyle, i = r.filter;
        i = i.replace(x, d), 0 !== +e ? (this.attrs.blur = e, r.filter = i + p + f + ".Blur(pixelradius=" + (+e || 1.5) + ")", r.margin = t.format("-{0}px 0 0 -{0}px", a(+e || 1.5))) : (r.filter = i, r.margin = 0, delete this.attrs.blur)
    }, t._engine.path = function (t, e) {
        var r = L("shape");
        r.style.cssText = m, r.coordsize = b + p + b, r.coordorigin = e.coordorigin;
        var i = new N(r, e), n = {fill: "none", stroke: "#000"};
        t && (n.path = t), i.type = "path", i.path = [], i.Path = d, A(i, n), e.canvas.appendChild(r);
        var a = L("skew");
        return a.on = !0, r.appendChild(a), i.skew = a, i.transform(d), i
    }, t._engine.rect = function (e, r, i, n, a, s) {
        var o = t._rectPath(r, i, n, a, s), l = e.path(o), h = l.attrs;
        return l.X = h.x = r, l.Y = h.y = i, l.W = h.width = n, l.H = h.height = a, h.r = s, h.path = o, l.type = "rect", l
    }, t._engine.ellipse = function (t, e, r, i, n) {
        var a = t.path();
        return a.attrs, a.X = e - i, a.Y = r - n, a.W = 2 * i, a.H = 2 * n, a.type = "ellipse", A(a, {cx: e, cy: r, rx: i, ry: n}), a
    }, t._engine.circle = function (t, e, r, i) {
        var n = t.path();
        return n.attrs, n.X = e - i, n.Y = r - i, n.W = n.H = 2 * i, n.type = "circle", A(n, {cx: e, cy: r, r: i}), n
    }, t._engine.image = function (e, r, i, n, a, s) {
        var o = t._rectPath(i, n, a, s), l = e.path(o).attr({stroke: "none"}), u = l.attrs, c = l.node, f = c.getElementsByTagName(h)[0];
        return u.src = r, l.X = u.x = i, l.Y = u.y = n, l.W = u.width = a, l.H = u.height = s, u.path = o, l.type = "image", f.parentNode == c && c.removeChild(f), f.rotate = !0, f.src = r, f.type = "tile", l._.fillpos = [i, n], l._.fillsize = [a, s], c.appendChild(f), B(l, 1, 1, 0, 0, 0), l
    }, t._engine.text = function (e, i, n, s) {
        var o = L("shape"), l = L("path"), h = L("textpath");
        i = i || 0, n = n || 0, s = s || "", l.v = t.format("m{0},{1}l{2},{1}", a(i * b), a(n * b), a(i * b) + 1), l.textpathok = !0, h.string = r(s), h.on = !0, o.style.cssText = m, o.coordsize = b + p + b, o.coordorigin = "0 0";
        var u = new N(o, e), c = {fill: "#000", stroke: "none", font: t._availableAttrs.font, text: s};
        u.shape = o, u.path = l, u.textpath = h, u.type = "text", u.attrs.text = r(s), u.attrs.x = i, u.attrs.y = n, u.attrs.w = 1, u.attrs.h = 1, A(u, c), o.appendChild(h), o.appendChild(l), e.canvas.appendChild(o);
        var f = L("skew");
        return f.on = !0, o.appendChild(f), u.skew = f, u.transform(d), u
    }, t._engine.setSize = function (e, r) {
        var i = this.canvas.style;
        return this.width = e, this.height = r, e == +e && (e += "px"), r == +r && (r += "px"), i.width = e, i.height = r, i.clip = "rect(0 " + e + " " + r + " 0)", this._viewBox && t._engine.setViewBox.apply(this, this._viewBox), this
    }, t._engine.setViewBox = function (e, r, i, n, a) {
        t.eve("raphael.setViewBox", this, this._viewBox, [e, r, i, n, a]);
        var o, l, h = this.width, u = this.height, c = 1 / s(i / h, n / u);
        return a && (o = u / n, l = h / i, h > i * o && (e -= (h - i * o) / 2 / o), u > n * l && (r -= (u - n * l) / 2 / l)), this._viewBox = [e, r, i, n, !!a], this._viewBoxShift = {dx: -e, dy: -r, scale: c}, this.forEach(function (t) {
            t.transform("...")
        }), this
    };
    var L;
    t._engine.initWin = function (t) {
        var e = t.document;
        e.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");
        try {
            !e.namespaces.rvml && e.namespaces.add("rvml", "urn:schemas-microsoft-com:vml"), L = function (t) {
                return e.createElement("<rvml:" + t + ' class="rvml">')
            }
        } catch (r) {
            L = function (t) {
                return e.createElement("<" + t + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">')
            }
        }
    }, t._engine.initWin(t._g.win), t._engine.create = function () {
        var e = t._getContainer.apply(0, arguments), r = e.container, i = e.height, n = e.width, a = e.x, s = e.y;
        if (!r)throw Error("VML container not found.");
        var o = new t._Paper, l = o.canvas = t._g.doc.createElement("div"), h = l.style;
        return a = a || 0, s = s || 0, n = n || 512, i = i || 342, o.width = n, o.height = i, n == +n && (n += "px"), i == +i && (i += "px"), o.coordsize = 1e3 * b + p + 1e3 * b, o.coordorigin = "0 0", o.span = t._g.doc.createElement("span"), o.span.style.cssText = "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;", l.appendChild(o.span), h.cssText = t.format("top:0;left:0;width:{0};height:{1};display:inline-block;position:relative;clip:rect(0 {0} {1} 0);overflow:hidden", n, i), 1 == r ? (t._g.doc.body.appendChild(l), h.left = a + "px", h.top = s + "px", h.position = "absolute") : r.firstChild ? r.insertBefore(l, r.firstChild) : r.appendChild(l), o.renderfix = function () {
        }, o
    }, t.prototype.clear = function () {
        t.eve("raphael.clear", this), this.canvas.innerHTML = d, this.span = t._g.doc.createElement("span"), this.span.style.cssText = "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;", this.canvas.appendChild(this.span), this.bottom = this.top = null
    }, t.prototype.remove = function () {
        t.eve("raphael.remove", this), this.canvas.parentNode.removeChild(this.canvas);
        for (var e in this)this[e] = "function" == typeof this[e] ? t._removedFactory(e) : null;
        return!0
    };
    var M = t.st;
    for (var z in E)E[e](z) && !M[e](z) && (M[z] = function (t) {
        return function () {
            var e = arguments;
            return this.forEach(function (r) {
                r[t].apply(r, e)
            })
        }
    }(z))
}(window.Raphael);