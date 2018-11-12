require('../../models/models'); //created model loading here
const songController = require('../../controllers/songController');
const mongoose = require('mongoose')
const Song = require('../../models/songModel');

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

beforeEach(async () => {
    let promises = [];
    for(var model in mongoose.models) {
        promises.push(mongoose.models[model].remove({}));
    }
    await Promise.all(promises);
})

jest.setTimeout(10000)

describe('Add song', () => {

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

describe('delete_a_song', () => {

    test('delete_a_song success', async done => {
        var createReq = {
            body: {
                title: 'SongTitle',
                verses: [],
                order: []
            }
        }

        var songId;
    
        await new Promise(resolve => {
            let createSucess = (song) => {
                songId = song._id;
                resolve();
            }
            songController.create_a_song(createReq, new MockRes(createSucess));    
        })

        var deleteReq = {
            params: {
                songId: songId
            }
        }

        let status = (code) => { 
            if(code !== 204) {
                fail('return code should be 204');
                done();
            }
        
            expect(Song.findById(songId, ((err, res) => {
                if(err) 
                    fail('should not find song');
            })));
            done();
        }
    
        let json = (songs) => { 
            fail();
            done();
        }
    
        songController.delete_a_song(deleteReq, new MockRes(json, status));    
    });

    test('delete_a_song doesn\'t exist', async done => {

        var deleteReq = {
            params: {
                songId: '1235'
            }
        }

        let status = (code) => { 
            if(code !== 404) {
                fail('return code should be 404');
                done();
            }
            done();
        }
    
        let json = () => { 
            // done();
        }
    
        songController.delete_a_song(deleteReq, new MockRes(json, status));    
    });

})

describe('list_all_songs', () => {
    test('list_all_songs empty', done => {
        var req = {}

        let status = (code) => { 
            if(code !== 200) {
                fail();
                done();
            }
        }
    
        let json = (songs) => { 
            expect(songs).toHaveLength(0);
            done();
        }
    
        songController.list_all_songs(req, new MockRes(json, status));    
    });

    test('list_all_songs single', async done => {
        var req = {}

        let song = new Song({title: 'Song Title', verses: [], order: []});
        song = await song.save();

        let status = (code) => { 
            if(code !== 200) {
                fail();
                done();
            }
        }
    
        let json = (songs) => { 
            expect(songs).toHaveLength(1);
            expect(songs[0]._id).toEqual(song._id);
            expect(songs[0].title).toEqual('Song Title');
            expect(songs[0].verses).toHaveLength(0);
            expect(songs[0].order).toHaveLength(0);
            done();
        }
    
        songController.list_all_songs(req, new MockRes(json, status));    
    });

    test('list_all_songs many', async done => {
        var req = {}

        let songIds = [];
        for (let i = 0; i < 100; i++) {
            let song = new Song({title: 'Song Title' + i, verses: [], order: []});
            songIds.push((await song.save())._id);
        }

        let status = (code) => { 
            if(code !== 200) {
                fail();
                done();
            }
        }
    
        let json = (songs) => { 
            expect(songs).toHaveLength(100);
            for(let i = 0; i < 100; i++) {
                expect(songs[i]._id).toEqual(songIds[i]._id);
                expect(songs[i].title).toEqual('Song Title' + i);
            }
            done();
        }
    
        songController.list_all_songs(req, new MockRes(json, status));    
    });
});