var mongoose = require('mongoose');
var Users = mongoose.model('Users');

exports.getSettings = function(req, res) {
    Users.find({username: req.params.username}, (err, user) => {
        if(err) res.send(err);
        res.json(user);
    })
}

exports.patchSettings = async function(req, res) {
    let user = await Users.findOne({username: req.params.username});
    Users.findOneAndUpdate({ username: req.params.username },
        {settings: req.body}, { new: true }, (err, song) => {
        if (err) res.send(err);
        res.json(song);
    });
}