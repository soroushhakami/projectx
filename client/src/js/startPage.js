var StartPage = (function () {

    var render = function () {
        //let's fire it up!
        $(document).attr('title', 'Pairmodoro');
        var startHtml = JST['views/clientside/start.hbs']();
        $('#main_display').empty().append(startHtml);
        Pair.emptyPair();

        $.getJSON('/users', function (users) {
            $(users).each(function (i, user) {
                var userTemplate = JST['views/clientside/user.hbs'](user);
                $('#users').append(userTemplate);
                Users.addUser(user);
            });
            $('.loading').hide();
            initEventHandlers();
        });
    };

    var initEventHandlers = function () {
        $('.user').click(function () {
            var userAvatarElement = $(this).find('.avatar');
            var userNameText = $(this).find('.name').text();

            if (!Pair.isFullPair()) {
                userAvatarElement.toggleClass('selected');

                if (userAvatarElement.hasClass('selected')) {
                    Pair.addUser(userNameText);
                } else {
                    Pair.removeUser(userNameText);
                }
            } else if (Pair.hasUser(userNameText)) {
                userAvatarElement.toggleClass('selected');
                Pair.removeUser(userNameText);
            }
        });

        $('.chart-icon').click(function () {
            var userNameText = $(this).parent().find('.name').text();
            /*$(this).tooltip('destroy');*/
            StatsPage.render(userNameText);
        });

        /*$('.chart-icon').tooltip({
         'placement': 'left',
         'trigger': 'hover',
         'title': function(){
         return 'View stats for ' + $(this).parent().find('.name').text();
         }
         });*/

        $('#startBtn').click(function () {
            Notification.askForPermissions();
            TimerPage.render();
        });
    };

    return {
        render: render
    };
})();


