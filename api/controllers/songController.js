const { PPTXExporter } = require('../pptx/pptxExporter');

var mongoose = require('mongoose');
const Song = require('../models/songModel');
const SongList = mongoose.model('SongLists');
var {SocketManager} = require('../SocketManager');

exports.list_all_songs = function (req, res) {
    Song.find({}, function (err, song) {
        if (err)
            res.send(err);
        res.json(song);
    });
};

exports.list_all_verses = async function (req, res) {

    let song = await Song.findById(req.params.songId);
    let result = {
        verses: song.verses,
        order: song.order,
    }
    res.json(result);
};

exports.create_a_song = function (req, res) {
    var new_song = new Song(req.body);
    new_song.save(function (err, song) {
        if (err) {
            res.status(500).send(err);
        }
        res.json(song);
        SocketManager.getManager().updateClients('newDataEvent', {action: 'createSong', data: song});
    });
};

exports.read_a_song = function (req, res) {
    Song.findById(req.params.songId, function (err, song) {
        if (err) {
            res.send(err);
        }
        res.json(song);
    });
};

exports.update_a_song = function (req, res) {
    Song.findByIdAndUpdate(req.params.songId, req.body, { new: true }, function (err, song) {
        if (err)
            res.send(err);
        res.json(song);
    });
};

exports.delete_a_song = function (req, res) {
    
    Song.findByIdAndRemove(req.params.songId, function (err, song) {
        if (err) {
            res.send(err);
        }
        res.json({ message: 'Song successfully deleted' });
        SocketManager.getManager().updateClients('newDataEvent', {action: 'removeSong', data: {name: req.params.songName}});
    });
};

exports.delete_all_songs = function (req, res) {
    Song.remove({}, function (err, song) {
        if (err)
            res.send(err);
        res.json({ message: 'Song successfully deleted' });
    });
};

exports.create_a_verse = async function(req, res) {
    let song = await Song.findById(req.params.songId);

    let newVerse = song.verses.create({
        text: req.body.text,
        type: req.body.type,
    });
    song.verses.push(newVerse);

    song.save(function(err, song) {
        if (err) {
            res.send(err);
            return;
        }
        res.json(newVerse);
    });
};

exports.download_a_song = async function(req, res) {
    let song = await Song.findById(req.params.songId);
    let allVerses = song.verses;

    res.writeHead(200, {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-disposition': 'attachment; filename=' + song.title + '.pptx'
    });

    const exporter = new PPTXExporter();
    await exporter.addSong(song.title, allVerses);
    await exporter.exportPPTX(res);
    
}

exports.download_songs = async function(req, res) {
    let songIds = req.body;

    const exporter = new PPTXExporter();

    for(let i = 0; i < songIds.length; i++) {
        let song = await Song.findById(songIds[i]);
        let allVerses = song.verses;
        await exporter.addSong(song.title, allVerses);
    }

    res.writeHead(200, {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-disposition': 'attachment; filename=' + songIds[0] + '.pptx'
    });

    await exporter.exportPPTX(res);

}

exports.get_all_lists = async function(req, res) {
    const songLists = await SongList.find({});
    res.json(songLists);
}

exports.get_a_list = async function(req, res) {
    const songList = await SongList.findById(req.params.listId);
    res.json(songList);
}

exports.create_a_list = async function(req, res) {
    let songListObj = {...req.body};
    let newList = new SongList(songListObj);
    let list = await newList.save();

    res.json(newList);
}

exports.update_a_list = async function(req, res) {
    let newList = await SongList.findByIdAndUpdate(req.params.listId, {songIds: req.body.songs}, { new: true });

    res.json(newList);
}

exports.delete_a_list = async function(req, res) {
    SongList.findByIdAndRemove(req.params.listId).then(
        () => { res.json({message: "deleted"}) },
        err => { res.send(err) }
    );
}

exports.read_a_verse = async function (req, res) {
    let verse = await getVerseById(req.params.songId, req.params.verseId);
    res.json(verse);
};

exports.update_a_verse = async function (req, res) {
    let song = await Song.findById(req.params.songId);
    let verse =  song.verses.id(req.params.verseId);
    verse.text = req.body.text || verse.text;
    verse.type = req.body.type || verse.type;
    await saveAndReturnJson(song, res);
};

exports.delete_a_verse = async function (req, res) {
    let song = await Song.findById(req.params.songId);
    let verse =  song.verses.id(req.params.verseId);

    var newOrder = song.order.filter(verseId => {
        return verseId !== req.params.verseId;
    });

    song.order = newOrder;
    verse.remove();

    await saveAndReturnJson(song, res);
}; 

async function getVerseById(songId, verseId) {
    let song = await Song.findById(songId);
    return song.verses.id(verseId);
}

async function saveAndReturnJson(object, res) {
    return new Promise((resolve, reject) => {
        object.save((err, objectResult) => {
            if (err) {
                res.send(err);
                reject(err);
            }
            res.json(objectResult);
            resolve(objectResult);
        });
    });
}