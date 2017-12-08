var mongoose = require('mongoose');
var Verse = mongoose.model('Verses');

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
    Verse.findOne({ verseId: req.params.verseId }, function (err, verse) {
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
    Verse.findOneAndUpdate({ verseId: req.params.verseId }, req.body, { new: false }, function (err, verse) {
        if (err)
            res.send(err);
        res.json(verse);
    });
};

exports.delete_a_verse = function (req, res) {

    Verse.remove({
        verseId: req.params.verseId
    }, function (err, verse) {
        if (err)
            res.send(err);
        res.json({ message: 'Verse successfully deleted' });
    });
};
