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
    var verseList;
    var songOrder;

    let versePromise = Verse.find({songName: req.params.songName}, function (err, verses) {
        if (err)
            res.send(err);
        verseList = verses;
    }).then();

    let songPromise = Song.findOne({ name: req.params.songName }, function (err, song) {
        if (err) {
            res.send(err);
        }
        songOrder = song.order;
    }).then();

    Promise.all([songPromise, versePromise]).then(() => {
        let result = {
            verses: verseList,
            order: songOrder,
        }
        res.json(result);
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

exports.delete_all_songs = function (req, res) {

    Song.remove({}, function (err, song) {
        if (err)
            res.send(err);
        res.json({ message: 'Song successfully deleted' });
    });
};
