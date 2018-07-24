'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSessionSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'Users'},
    token: String,
    expires: Date,
    type: String // e.g google or worship_cloud
})


var UserSchema = new Schema({
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

module.exports = mongoose.model('Users', UserSchema);
module.exports = mongoose.model('UserSessions', UserSessionSchema);

var Users = mongoose.model('Users');

UserSessionSchema.pre('remove', function(next) {
    // 'this' is the client being removed. Provide callbacks here if you want
    // to be notified of the calls' result.
    Users.update(
        { sessions : this._id}, 
        { $pull: { sessions: this._id } },
        { multi: true }).exec();
    next();
});
