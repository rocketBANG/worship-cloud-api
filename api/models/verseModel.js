'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VerseSchema = new Schema({
    id: {
        type: String,
        required: 'Verses need a unique id',
        index: true,
        unique: true
    },
    text: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        enum: ['verse', 'chorus'],
        default: 'verse'
    },
    songName: {
        type: String,
        required: 'Verses need a parent song'
    }
});

module.exports = mongoose.model('Verses', VerseSchema);
