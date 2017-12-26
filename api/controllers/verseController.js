var mongoose = require('mongoose');
var Verse = mongoose.model('Verses');
var Song = mongoose.model('Songs');

exports.list_all_verses = function (req, res) {
    Verse.find({}, function (err, verse) {
        if (err)
            res.send(err);
        res.json(verse);
    });
};

exports.delete_all_verses = function(req, res) {
    Verse.remove({}, function(err, verse) {
        if (err) {
            res.send(err);
        }
        res.json({ message: 'All verses deleted' });
    });
}

exports.create_a_verse = function (req, res) {
    var new_verse = new Verse(req.body);
    new_verse.save(function (err, verse) {
        if (err)
            res.send(err);
        res.json(verse);
    });
};

exports.read_a_verse = function (req, res) {
    Verse.findOne({ id: req.params.verseId }, function (err, verse) {
        if (err) {
            res.status(505).json({ error: "error" });
        }
        if(verse === null) {
            res.status(404).json({ error: "verse not found" });
        } else {
            res.json(verse);
        }
    });
};

exports.update_a_verse = function (req, res) {
    Verse.findOneAndUpdate({ id: req.params.verseId }, req.body, { new: true }, function (err, verse) {
        if (err)
            res.send(err);
        res.json(verse);
    });
};

exports.delete_a_verse = function (req, res) {
    Verse.findOne({id: req.params.verseId}, function(err, verse) {

        Verse.remove({
            id: req.params.verseId
        }, function (err) {
            if (err)
            {
                res.send(err);
            } 
            Song.findOne({ name: verse.songName }, function (err, song) {
                if (err) {
                    res.send(err);
                }
                deleteVerse(song, req.params.verseId, res)
            });
        });
    })
}; 

const deleteVerse = (song, verseId, res) => {
    var newVerses = song.verses.filter((verse, index) => {
        return verse !== verseId;
    });

    var newOrder = song.order.filter((verse, index) => {
        return verse !== verseId;
    });

    Song.findOneAndUpdate({ name: song.name }, {verses: newVerses, order: newOrder}, function(err, song) {
        if (err) {
            res.send(err);
        } else {
            res.json({ message: 'Verse successfully deleted' });
        }
    });
}
