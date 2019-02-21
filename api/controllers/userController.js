import { model } from 'mongoose';
import { compare, hash } from 'bcryptjs';
import { getObj } from '../UserManager';
import { UserModel } from '../models/userModel';

export function getSettings(req, res) {
    UserModel.find({username: req.params.username, }, (err, user) => {
        if(err) res.json(err);
        res.json(user);
    })
}

export async function loginCookie(req, res) {
    let loginCooke = req.session.worship_login;

    let username = loginCooke && loginCooke.split('|')[1];
    let token = loginCooke && loginCooke.split('|')[0];

    const user = await getObj().VerifyUser(token);
    let correct = user !== null;
    
    if(correct) {
        res.json({key: token, username: username, success: true});
    } else {
        res.json({success: false});
    }
}

export async function logoutCookie(req, res) {
    let loginCooke = req.session.worship_login;
    req.session.worship_login = '';

    res.json({success: true});


}

export async function loginUser(req, res) {
    const user = await UserModel.findOne({username: req.params.username});
    if(!user || !user.password) {
        res.statusCode = 400;
        res.json();
        return;
    }

    let correct = user !== null && await compare(req.body.password, user.password);
    
    if(correct) {
        let token = await hash(new Date().toUTCString() + user.username + "key", 10);
        getObj().AddUser(token, user.username);
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

export async function updatePass(req, res) {
    const user = await UserModel.findOne({username: req.params.username});
    let pass = await hash(req.body.password, 10);
    user.password = pass;
    let saved = await user.save();
    
    if(saved) {
        res.json({success: true});
    } else {
        res.json({success: false});
    }
}

export async function patchSettings(req, res) {
    let user = await UserModel.findOne({username: req.params.username});
    UserModel.findOneAndUpdate({ username: req.params.username },
        {settings: req.body}, { new: true }, (err, song) => {
        if (err) res.json(err);
        res.json(song);
    });
}