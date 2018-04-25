'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var SongListSchema = new Schema({
    songIds: [
        String
    ],
    name: String
});

module.exports = mongoose.model('SongLists', SongListSchema);
