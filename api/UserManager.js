var mongoose = require('mongoose');
var Users = mongoose.model('Users');
var UserSessions = mongoose.model('UserSessions');
const moment = require('moment');

class UserManager {

    static getObj() {
        if(UserManager.Obj === undefined){
            UserManager.Obj = new UserManager();
        }
        return UserManager.Obj;
    }

    constructor() {
        this.userList = [];
        this.AddUser = this.AddUser.bind(this);
        this.VerifyUser = this.VerifyUser.bind(this);
    }

    async Init() {
        let expiredSessions = await UserSessions.find().where('expires').lt(moment()).populate('user').exec();
        expiredSessions.forEach(e => e.remove());
    }

    async AddUser(authToken, username) {
        // this.userList.push({authToken, username});
        let user = await Users.findOne({username: username});
        user.sessions = user.sessions || [];

        let userSession = new UserSessions();
        userSession.token = authToken;
        userSession.expires = moment().add(21, "days");
        userSession.type = 'worship_cloud';
        userSession.user = user;

        user.sessions.push(userSession);
        userSession.save();
        user.save()
    }

    async VerifyUser(authToken) {
        let userSession = await UserSessions.findOne({token: authToken});

        if(userSession === null) return null;

        return userSession.user;
    }
}

module.exports = UserManager;