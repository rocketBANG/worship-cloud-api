require('../models/models'); //created model loading here
const songController = require('./songController');
const mongoose = require('mongoose')

beforeAll(async () => {
    let mongoUri = global.__MONGO_URI__;

    mongoose.Promise = Promise;
    const mongooseOpts = { // options for mongoose 4.11.3 and above
        autoReconnect: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000,
    };

    mongoose.connect(mongoUri, mongooseOpts);

    mongoose.connection.on('error', (e) => {
        if (e.message.code === 'ETIMEDOUT') {
            console.log(e);
            mongoose.connect(mongoUri, mongooseOpts);
        }
        console.log(e);
    });

});

afterAll(async () => {
    await mongoose.disconnect();
});

class MockRes {
    constructor(jsonFunc, statusFunc) {
        this.jsonFunc = jsonFunc;
        this.statusFunc = statusFunc;
    }

    status(code) {
        this.statusFunc && this.statusFunc(code);
        return this;
    }

    json(obj) {
        this.jsonFunc && this.jsonFunc(obj);
        return this;
    }
}

jest.setTimeout(10000)

describe('Add song', () => {

    beforeEach(async () => {
        let promises = [];
        for(var model in mongoose.models) {
            promises.push(mongoose.models[model].remove({}));
        }
        await Promise.all(promises);
    })

    const checkSong = (song, songTitle, verseLength) => {
        expect(song._id).toBeDefined();
        expect(song.title).toBe(songTitle);
        expect(song.verses).toHaveLength(verseLength);
        expect(song.order).toHaveLength(0);
        return;
    }

    const checkVerse = (verse, verseType, verseText) => {
        expect(verse._id).toBeDefined();
        expect(verse.type).toBe(verseType);
        expect(verse.text).toBe(verseText);
    }

    test('create_a_song single', async done => {    
        var req = {
            body: {
                title: 'SongTitle',
                verses: [],
                order: []
            }
        }
    
        await new Promise(resolve => {
            let createSucess = (song) => {
                checkSong(song, req.body.title, 0);
                resolve();
            }
            songController.create_a_song(req, new MockRes(createSucess));    
        })
    
        listSucess = (list) => {
            expect(list).toHaveLength(1);
            done();
        }
        songController.list_all_songs({}, new MockRes(listSucess));
    })

    test('create_a_song with a verse', done => {    
        var req = {
            body: {
                title: 'SongTitle',
                verses: [{
                    type: 'verse',
                    text: 'hello there'
                }],
                order: []
            }
        }
    
        let createSucess = (song) => {
            checkSong(song, req.body.title, 1);
            checkVerse(song.verses[0], req.body.verses[0].type, req.body.verses[0].text);
            done();
        }
        songController.create_a_song(req, new MockRes(createSucess));    
    })

    test('create_a_song with multiple verses', done => {    
        var req = {
            body: {
                title: 'SongTitle',
                verses: [
                {
                    type: 'verse',
                    text: 'hello there'
                }, 
                {
                    type: 'chorus',
                    text: 'two\nlines'
                }],
                order: []
            }
        }
    
        let createSucess = (song) => {
            checkSong(song, req.body.title, 2);
            checkVerse(song.verses[0], req.body.verses[0].type, req.body.verses[0].text);
            checkVerse(song.verses[1], req.body.verses[1].type, req.body.verses[1].text);
            done();
        }
        songController.create_a_song(req, new MockRes(createSucess));    
    })

    test('create_a_song with empty verses', done => {    
        var req = {
            body: {
                title: 'SongTitle',
                verses: [
                {
                }, 
                {
                }],
                order: []
            }
        }
    
        let createSucess = (song) => {
            checkSong(song, req.body.title, 2);
            checkVerse(song.verses[0], 'verse', '');
            checkVerse(song.verses[1], 'verse', '');
            done();
        }
        songController.create_a_song(req, new MockRes(createSucess));    
    })

    test('create_a_song same name', async done => {    
        var req = {
            body: {
                title: 'SongTitle',
                verses: [],
                order: []
            }
        }
    
        await new Promise(resolve => {
            let createSucess = (song) => { 
                checkSong(song, req.body.title, 0);
                resolve(); 
            }
            songController.create_a_song(req, new MockRes(createSucess));    
        })

        await new Promise(resolve => {
            let createSucess = (song) => { 
                checkSong(song, req.body.title, 0);
                resolve(); 
            }
            songController.create_a_song(req, new MockRes(createSucess));    
        })
    
        listSucess = (list) => {
            expect(list).toHaveLength(2);
            done();
        }
        songController.list_all_songs({}, new MockRes(listSucess));
    })

    test('create_a_song no title', done => {    
        var req = {
            body: {
                verses: [],
                order: []
            }
        }
    
        let status = (code) => { 
            expect(code).toBe(500);
            done();
        }
        songController.create_a_song(req, new MockRes(undefined, status));    
    })

    test('create_a_song no verses', done => {    
        var req = {
            body: {
                title: 'Test Song',
                order: []
            }
        }
    
        let status = (code) => { 
            if(code % 100 !== 2) {
                fail();
                done();    
            }
        }
        let json = (song) => { 
            checkSong(song, req.body.title, 0);
            done();
        }
        songController.create_a_song(req, new MockRes(json, status));    
    })

    test('create_a_song no order', done => {    
        var req = {
            body: {
                title: 'S',
                verses: [],
            }
        }
    
        let status = (code) => { 
            if(code % 100 !== 2) {
                fail();
                done();    
            }
        }
        let json = (song) => { 
            checkSong(song, req.body.title, 0);
            done();
        }
        songController.create_a_song(req, new MockRes(json, status));    
    })

    test('create_a_song only title', done => {    
        var req = {
            body: {
                title: 'S'
            }
        }
    
        let status = (code) => { 
            if(code % 100 !== 2) {
                fail();
                done();    
            }
        }
        let json = (song) => { 
            checkSong(song, req.body.title, 0);
            done();
        }
        songController.create_a_song(req, new MockRes(json, status));    
    })

    test('create_a_song empty title', done => {    
        var req = {
            body: {
                title: ''
            }
        }
    
        let status = (code) => { 
            expect(code).toBe(500);
            done();
        }
        songController.create_a_song(req, new MockRes(undefined, status));    
    })

    
})
