import { model } from 'mongoose';
import { compare, hash } from 'bcryptjs';
import { getObj } from '../UserManager';
import { UserModel, IUser } from '../models/userModel';
import express = require('express');
import expressValidator = require('express-validator');

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

export async function createUser(req: express.Request, res: express.Response) {
    req.checkBody("password", "There must be a password").notEmpty();
    req.checkParams("username", "Username is not valid").notEmpty();

    if (checkAndFormatErrors(req, res)) return;

    const user = <IUser> {
        password: await hash(req.body.password, 10),
        sessions: [],
        settings: generateDefaultSettings(),
        userLevel: "0",
        username: req.params.username,
    }

    let dbUser = new UserModel({ ...user });

    try {
        await dbUser.save();
    } catch (error) {
        res.status(400).json({ error: new CustomError("username", "User already exists", req.params.username) });
        return;
    }

    res.json(true);
}

function generateDefaultSettings(): IUser["settings"] {
    return <IUser["settings"]> {
        // No default settings atm - use frontend definitions
    }
}

export class CustomError {
    constructor(public message: string, public entity?: string, public value?: string) {

    }
}

export function checkAndFormatErrors(req: express.Request, res: express.Response) {
    const errors = req.validationErrors();
  
    if (errors) {
        res.status(400).json({ 
            error: { validationErrors: errors } 
        });
        return true;
    }

    return false;
}