var Timer = (function () {
    var countdown;
    var startPomodoro = function(){
        $('#timerMessage').css('visibility','hidden');
        startPomodoroTimer();
    };

    var startBreak = function(){
        $('#timerMessage').css('visibility','hidden');
        $('.timer').removeClass('red');
        startBreakTimer();
    };

    function displayTime(duration, negative) {
        var time = moment(duration.asMilliseconds()).format('mm:ss');
        if(negative){
          time = '- ' + time;
        }
        $('.timer').text(time);
        $(document).attr('title',time);
    }

    function timeOver(duration) {
        return duration.minutes() === 0 && duration.seconds() === 0;
    }

    var startPomodoroTimer = function(){
        var duration = moment.duration(25, 'minutes');

        displayTime(duration);

            countdown = setInterval(function(){
            duration = moment.duration(duration.asSeconds() - 1, 'seconds');

            if(timeOver(duration)){
                pomodoroDone();
            }

            displayTime(duration);
        }, 1000);
    };

    var startBreakTimer = function(){
        var duration = moment.duration(5, 'minutes');

        displayTime(duration);

            countdown = setInterval(function(){
            duration = moment.duration(duration.asSeconds() - 1, 'seconds');

            if(timeOver(duration)){
                breakDone();
            }

            displayTime(duration);
        }, 1000);
    };

    var startBreakDoneTimer = function(){
        $('.timer').addClass('red');
        var duration = moment.duration(0, 'seconds');

        displayTime(duration, true);

        countdown = setInterval(function(){
            duration = moment.duration(duration.asSeconds() + 1, 'seconds');

            displayTime(duration, true);
        }, 1000);
    };

    var pomodoroDone = function(){
        killTimer();
        $('#breakBtn').removeAttr('disabled');
        $('#timerMessage').css('visibility','visible').hide().fadeIn('slow');
        Notification.showPomodoroDone();

        var pair = Pair.getUsers();
        Session.saveSession(pair[0].name, pair[1].name);
    };

    var breakDone = function(){
        killTimer();
        $('#breakBtn').attr('disabled', 'disabled');
        $('#timerMessage').text('Break over, switch driver.').css('visibility','visible').hide().fadeIn('slow');
        startBreakDoneTimer();
        Notification.showBreakDone();
    };

    var killTimer = function(){
      clearTimeout(countdown);
    };

    return {
        startPomodoro:startPomodoro,
        startBreak:startBreak,
        killTimer:killTimer
    };
})();
