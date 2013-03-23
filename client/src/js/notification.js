var Notification = (function () {
    var img = 'http://i.imgur.com/i56rnqe.png';
    var notification;

    var showPomodoroDone = function(){
        notification = window.webkitNotifications.createNotification(
            img, 'Pomodoro done', 'Now take a break.');
        notification.show();
    };

    var showBreakDone = function(){
        notification = window.webkitNotifications.createNotification(
            img, 'Break done', 'Now get back to work.');
        notification.show();
    };

    var askForPermissions = function(){
        if (!window.webkitNotifications){
            return;
        }
        window.webkitNotifications.requestPermission(function(){
            console.log(window.webkitNotifications.checkPermission() === 0 ? 'Has permissions for notifications ' :
                'Didnt get permissions for notifications');
        });
    };

    var closeNotification = function(){
        if(notification){
            notification.close();
        }
    };
    return {
        showPomodoroDone:showPomodoroDone,
        showBreakDone: showBreakDone,
        askForPermissions: askForPermissions,
        closeNotification: closeNotification
    };
})();



