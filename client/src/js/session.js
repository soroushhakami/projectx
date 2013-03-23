var Session = (function () {
    var saveSession = function(userOne, userTwo){
        $.getJSON('/saveSession?userOne='+userOne+'&userTwo='+userTwo);
    };

    return {
        saveSession:saveSession
    };
})();

