var mongoose = require('mongoose');
var Song = mongoose.model('Songs');
var Verse = mongoose.model('Verses');

exports.list_all_songs = function (req, res) {
    Song.find({}, function (err, song) {
        if (err)
            res.send(err);
        res.json(song);
    });
};

exports.list_all_verses = function (req, res) {
    Verse.find({songName: req.params.songName}, function (err, song) {
        if (err)
            res.send(err);
        res.json(song);
    });
};

exports.create_a_song = function (req, res) {
    var new_song = new Song(req.body);
    new_song.save(function (err, song) {
        if (err)
            res.send(err);
        res.json(song);
    });
};

exports.read_a_song = function (req, res) {
    Song.findOne({ name: req.params.songName }, function (err, song) {
        if (err) {
            res.send(err);
        }
        res.json(song);
    });
};

exports.update_a_song = function (req, res) {
    Song.findOneAndUpdate({ name: req.params.songName }, req.body, { new: true }, function (err, song) {
        if (err)
            res.send(err);
        res.json(song);
    });
};

exports.delete_a_song = function (req, res) {

    Song.remove({
        name: req.params.songName
    }, function (err, song) {
        if (err)
            res.send(err);
        res.json({ message: 'Song successfully deleted' });
    });
};
