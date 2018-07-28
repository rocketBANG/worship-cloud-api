var mongoose = require('mongoose');
var Users = mongoose.model('Users');
const bcrypt = require('bcryptjs');
const UserManager = require('../UserManager');
const moment = require('moment');

exports.getSettings = function(req, res) {
    Users.find({username: req.params.username}, (err, user) => {
        if(err) res.json(err);
        res.json(user);
    })
}

exports.loginCookie = async function(req, res) {
    let loginCooke = req.session.worship_login;

    let username = loginCooke && loginCooke.split('|')[1];
    let token = loginCooke && loginCooke.split('|')[0];

    const user = await UserManager.getObj().VerifyUser(token);
    let correct = user !== null;
    
    if(correct) {
        res.json({key: token, username: username, success: true});
    } else {
        res.json({success: false});
    }
}

exports.logoutCookie = async function(req, res) {
    let loginCooke = req.session.worship_login;
    req.session.worship_login = '';

    res.json({success: true});


}

exports.loginUser = async function(req, res) {
    const user = await Users.findOne({username: req.params.username});
    if(!user || !user.password) {
        res.statusCode = 400;
        res.json();
        return;
    }

    let correct = user !== null && await bcrypt.compare(req.body.password, user.password);
    
    if(correct) {
        let token = await bcrypt.hash(new Date().toUTCString() + user.username + "key", 10);
        UserManager.getObj().AddUser(token, user.username);
        // user.sessions = user.sessions || [];
        // user.sessions = [...user.sessions, {
        //     expires: moment().add(21, "days"),
        //     token: token
        // }];
        // await user.save();
        req.session.worship_login = token + '|' + user.username;
        res.json({key: token, success: true});
    } else {
        res.json({success: false});
    }
}

exports.updatePass = async function(req, res) {
    const user = await Users.findOne({username: req.params.username});
    let pass = await bcrypt.hash(req.body.password, 10);
    user.password = pass;
    let saved = await user.save();
    
    if(saved) {
        res.json({success: true});
    } else {
        res.json({success: false});
    }
}

exports.patchSettings = async function(req, res) {
    let user = await Users.findOne({username: req.params.username});
    Users.findOneAndUpdate({ username: req.params.username },
        {settings: req.body}, { new: true }, (err, song) => {
        if (err) res.json(err);
        res.json(song);
    });
}