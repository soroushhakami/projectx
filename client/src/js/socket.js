var Socket = (function () {
    var socket;
    var enabled = false;
    var init = function(){
        socket = io.connect();
        socket.on('progressUpdate', function(progressUpdateJSON){
           if(enabled){
               var progressUpdate = JSON.parse(progressUpdateJSON);
               var progressUpdateTemplate = ich.progressUpdate({
                   'userOne': progressUpdate.users[0],
                   'userTwo': progressUpdate.users[1],
                   'time': progressUpdate.time
               });
               var elem = $('#'+progressUpdate.users[0]+progressUpdate.users[1]);
               if(elem.length){
                   elem.empty().append(progressUpdateTemplate);
               } else{
                   $('#progressUpdates').append(progressUpdateTemplate);
               }
           }
        });
    };

    var sendProgress = function(time){
       var users = Pair.getUsers();

       var progressUpdate = {};
       progressUpdate.users = [users[0].name, users[1].name];
       progressUpdate.time = time;

        socket.emit('progressUpdate', JSON.stringify(progressUpdate));
    };

    var enable = function(){
        enabled = true;
    };

    return {
        init:init,
        sendProgress:sendProgress,
        enable: enable
    };
})();

