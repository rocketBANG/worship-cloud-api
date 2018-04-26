'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var VerseSchema = new Schema({
    type: {
        type: String,
        enum: ['verse', 'chorus'],
        default: 'verse'
    },
    text: String
})

var SongSchema = new Schema({
    title: String,
    verses: [VerseSchema],
    order: [String]
});

module.exports = mongoose.model('Songs', SongSchema);
