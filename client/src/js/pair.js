var Pair = (function () {
    var pair = new LacesModel();
    pair.users = new LacesArray();

    pair.users.bind("change", function(event) {
        if(Pair.isFullPair()){
            $('#startBtn').removeAttr('disabled');
        } else {
            $('#startBtn').attr('disabled', 'disabled');
        }
    });

    var addUser = function(userName){
        var user = Users.getUser(userName);
        pair.users.push(user);
    };

    var removeUser = function(userName){
        $.each(pair.users, function(i, user){
            if(user.name == userName){
                pair.users.remove(i);
                return false;
            }
        });
    };

    var isFullPair = function(){
        return pair.users.length == 2;
    };

    var hasUser = function(userName){
        var userFound = false;
        $.each(pair.users, function(i, user){
            if(user.name == userName)
                userFound = true;
        });
        return userFound;
    };

    var getUsers = function(){
        return pair.users;
    };

    var emptyPair = function(){
      pair.users.pop();
      pair.users.pop();
    };

    return {
        addUser:addUser,
        removeUser:removeUser,
        emptyPair:emptyPair,
        hasUser: hasUser,
        getUsers: getUsers,
        isFullPair: isFullPair
    };
})();



