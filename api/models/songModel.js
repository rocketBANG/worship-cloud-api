'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var SongSchema = new Schema({
    name: {
        type: String,
        required: 'Songs need a unique name',
        index: true,
        unique: true
    },
    title: String,
    verses: {
        type: [String],
    },
    order: {
        type: [String],
    }
});

module.exports = mongoose.model('Songs', SongSchema);
