'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var VerseSchema = new Schema({
    type: {
        type: String,
        enum: ['verse', 'chorus'],
        default: 'verse'
    },
    text: {
        type: String,
        default: ''
    }
})

var SongSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 1
    },
    verses: {
        type: [VerseSchema],
        default: []
    },
    order: {
        type: [String],
        default: []
    }
});

module.exports = mongoose.model('Songs', SongSchema);
