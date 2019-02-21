import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export interface IUserSession extends mongoose.Document {
    user: IUser;
    token: string;
    expires: Date;
    type: string;
}

const UserSessionSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'Users'},
    token: String,
    expires: Date,
    type: String // e.g google or worship_cloud
})

export interface IUser extends mongoose.Document {
    username: string;
    password: string;
    settings: {
        wordFontSize: number,
        titleFontSize: number,
        lineHeight: number,
        minimumPageLines: number,
        maximumPageLines: number,
        topMargin: number,
        leftMargin: number,
        rightMargin: number,
        titleMargin: number,
        indentAmount: number
    };
    userLevel: string;
    sessions: IUserSession[];
  }  


const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    password: String,
    settings: {
        wordFontSize: Number,
        titleFontSize: Number,
        lineHeight: Number,
        minimumPageLines: Number,
        maximumPageLines: Number,
        topMargin: Number,
        leftMargin: Number,
        rightMargin: Number,
        titleMargin: Number,
        indentAmount: Number
    },
    userLevel: String,
    sessions: [{type: Schema.Types.ObjectId, ref: 'UserSessions'}],
});

UserSessionSchema.pre('remove', function(next: () => void) {
    // 'this' is the client being removed. Provide callbacks here if you want
    // to be notified of the calls' result.
    UserModel.update(
        { sessions : this._id}, 
        { $pull: { sessions: this._id } },
        { multi: true }).exec();
    next();
});

export const UserModel = mongoose.model<IUser>('Users', UserSchema);
export const UserSessionModel = mongoose.model<IUserSession>('UserSessions', UserSessionSchema);

