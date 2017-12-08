var mongoose = require('mongoose'),
    Song = mongoose.model('Songs');

exports.list_all_songs = function (req, res) {
    Song.find({}, function (err, song) {
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
    Song.findById(req.params.songId, function (err, song) {
        if (err)
            res.send(err);
        res.json(song);
    });
};

exports.update_a_song = function (req, res) {
    Song.findOneAndUpdate({ _id: req.params.songId }, req.body, { new: true }, function (err, song) {
        if (err)
            res.send(err);
        res.json(song);
    });
};

exports.delete_a_song = function (req, res) {

    Song.remove({
        _id: req.params.songId
    }, function (err, song) {
        if (err)
            res.send(err);
        res.json({ message: 'Song successfully deleted' });
    });
};
