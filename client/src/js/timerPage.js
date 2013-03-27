var TimerPage = (function () {

    var render = function () {
        var pair = Pair.getUsers();
        $('#main_display').empty().append(JST['views/clientside/timer.hbs']({
            userOne: pair[0].name,
            userTwo: pair[1].name
        }));
        Timer.startPomodoro();
        initEventHandlers();
    };

    var initEventHandlers = function () {
        $('#pomodoroBtn').click(function () {
            Timer.killTimer();
            Notification.closeNotification();
            TimerPage.render();
        });

        $('#breakBtn').click(function () {
            Timer.killTimer();
            Notification.closeNotification();
            Timer.startBreak();
        });

        $('#changePairBtn').click(function () {
            Notification.closeNotification();
            Timer.killTimer();
            StartPage.render();
        });
    };

    return {
        render: render
    };
})();


