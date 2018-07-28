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
    constructor(jsonFunc, sendFunc, statusFunc) {
        this.sendFunc = sendFunc;
        this.jsonFunc = jsonFunc;
        this.statusFunc = statusFunc;
    }

    status(code) {
        this.statusFunc && this.statusFunc(code);
        return this;
    }

    send(obj) {
        this.sendFunc && this.sendFunc(obj);
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
                expect(song._id).toBeDefined();
                expect(song.title).toBe(req.body.title);
                expect(song.verses).toHaveLength(0);
                expect(song.order).toHaveLength(0);
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

    test('create_a_song same name', async done => {    
        var req = {
            body: {
                title: 'SongTitle',
                verses: [],
                order: []
            }
        }
    
        await new Promise(resolve => {
            let createSucess = () => { resolve(); }
            songController.create_a_song(req, new MockRes(createSucess));    
        })

        await new Promise(resolve => {
            let createSucess = () => { resolve(); }
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
        let json = () => { fail(); done() }
        songController.create_a_song(req, new MockRes(json, json, status));    

        // listSucess = (list) => {
        //     expect(list).toHaveLength(2);
        //     done();
        // }
        // songController.list_all_songs({}, new MockRes(listSucess));
    })

    
})
