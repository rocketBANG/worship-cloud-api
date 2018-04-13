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

    AddUser(authToken, username) {
        this.userList.push({authToken, username});
    }

    VerifyUser(authToken) {
        return this.userList.find(u => u.authToken === authToken);
    }
}

module.exports = UserManager;