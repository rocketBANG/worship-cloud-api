import moment from 'moment';
import { UserModel, UserSessionModel } from './models/userModel';

let obj: UserManager = undefined;

export const getObj = (): UserManager => {
    if(obj === undefined){
        obj = new UserManager();
    }
    return obj;
}

class UserManager {
    userList: any[];

    constructor() {
        this.userList = [];
        this.AddUser = this.AddUser.bind(this);
        this.VerifyUser = this.VerifyUser.bind(this);
    }

    async Init() {

        let expiredSessions = await UserModel.find().where('expires').lt(moment()).populate('user').exec();
        expiredSessions.forEach(e => e.remove());
    }

    async AddUser(authToken: any, username: any) {
        // this.userList.push({authToken, username});
        let user: any = await UserModel.findOne({username: username});
        user.sessions = user.sessions || [];

        let userSession: any = new UserSessionModel();
        userSession.token = authToken;
        userSession.expires = moment().add(21, "days");
        userSession.type = 'worship_cloud';
        userSession.user = user;

        user.sessions.push(userSession);
        userSession.save();
        user.save()
    }

    async VerifyUser(authToken: any) {
        let userSession: any = await UserSessionModel.findOne({token: authToken});

        if(userSession === null) return null;

        return userSession.user;
    }
}

export default UserManager;