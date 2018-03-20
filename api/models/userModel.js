'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
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
    }
});

module.exports = mongoose.model('Users', UserSchema);
