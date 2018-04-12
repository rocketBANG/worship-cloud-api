var mongoose = require('mongoose');
var Users = mongoose.model('Users');

exports.getSettings = function(req, res) {
    Users.find({username: req.params.username}, (err, user) => {
        if(err) res.send(err);
        res.json(user);
    })
}

exports.loginUser = async function(req, res) {
    const user = await Users.findOne({username: req.params.username});
    if(user !== null && user.password === req.body.password) {
        res.json({key: user.username + "key", success: true});
    } else {
        res.json({success: false});
    }
}

exports.patchSettings = async function(req, res) {
    let user = await Users.findOne({username: req.params.username});
    Users.findOneAndUpdate({ username: req.params.username },
        {settings: Object.assign(user.settings, req.body)}, { new: true }, (err, song) => {
        if (err) res.send(err);
        res.json(song);
    });
}