var Users = (function () {

    var users = new LacesMap();

    users.bind("change", function(event) {
    });

    var addUser = function(user){
        var userModel = new LacesModel({
            name: user.name,
            image: user.image
        });
        users.set(user.name, userModel);
    };

    var getUser = function(name){
        return users.get(name);
    };

    return {
        addUser:addUser,
        getUser:getUser
    };
})();
