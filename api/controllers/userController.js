var mongoose = require('mongoose');
var Users = mongoose.model('Users');

exports.getSettings = function(req, res) {
    Users.find({username: req.params.username}, (err, user) => {
        if(err) res.send(err);
        res.json(user);
    })
}

exports.patchSettings = function(req, res) {
    Users.findOneAndUpdate({ username: req.params.username },
        {settings: req.body}, { new: true }, function (err, song) {
        if (err) res.send(err);
        res.json(song);
    });
}