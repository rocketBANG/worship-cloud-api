'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var SongListSchema = new Schema({
    id: {
        type: String,
        index: true,
        unique: true
    },
    songs: [{
        name: String,
        title: String  
    }],
    name: String
});

module.exports = mongoose.model('SongLists', SongListSchema);
