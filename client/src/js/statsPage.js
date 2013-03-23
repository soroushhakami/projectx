var StatsPage = (function () {

    var render = function (userName) {
        $('#main_display').empty().append(JST['views/clientside/stats.hbs']({name: userName}));
        initEventHandlers();

        var sessionData = {};
        $.getJSON('/getSessionsForUser?user='+userName, function(sessions){

            $.each(sessions, function(i, session){
                var key = session.users[0] == userName ? session.users[1] : session.users[0];
                if (!sessionData[key]){
                    sessionData[key] = 1;
                } else{
                    sessionData[key] += 1;
                }
            });
            console.log(sessionData);
            $('.loading').hide();
            createGraph(userName, sessionData);
        });

    };

    var createGraph = function(userName, sessionData){
        var graphData = [];
        $.each(sessionData, function(otherUser, sessionCount){
            var otherUserName = otherUser.length > 5 ? otherUser.substring(0,1) +"dog" : otherUser;
           graphData.push({ y: otherUserName, a: sessionCount});
        });
        Morris.Bar({
            element: 'statistics',
            data: graphData,
            xkey: 'y',
            ykeys: 'a',
            labels: ['Pomodoros finished'],
            barColors: ['rgb(0, 153, 221)']
        });
    };

    var initEventHandlers = function(){
       $('#backBtn').click(function(){
          StartPage.render();
       });
    };

    return {
        render:render
    };
})();


