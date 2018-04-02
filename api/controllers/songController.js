const { PPTXExporter } = require('../pptx/pptxExporter');

var mongoose = require('mongoose');
var Song = mongoose.model('Songs');
var Verse = mongoose.model('Verses');
const SongList = mongoose.model('SongLists');
var {SocketManager} = require('../SocketManager');

exports.list_all_songs = function (req, res) {
    Song.find({}, function (err, song) {
        if (err)
            res.send(err);
        res.json(song);
    });
};

exports.list_all_verses = function (req, res) {

    Promise.all([Verse.find({songName: req.params.songName}), Song.findOne({ name: req.params.songName })])
    .then(([verses, song]) => {
        let result = {
            verses: verses,
            order: song.order,
        }
        res.json(result);
})
};

exports.create_a_song = function (req, res) {
    var new_song = new Song(req.body);
    new_song.save(function (err, song) {
        if (err) {
            res.status(500).send(err);
        }
        res.json(song);
        SocketManager.getManager().updateClients('newDataEvent', {action: 'createSong', data: new_song});
    });
};

exports.read_a_song = function (req, res) {
    Song.findOne({ name: req.params.songName }, function (err, song) {
        if (err) {
            res.send(err);
        }
        res.json(song);
    });
};

exports.update_a_song = function (req, res) {
    Song.findOneAndUpdate({ name: req.params.songName }, req.body, { new: true }, function (err, song) {
        if (err)
            res.send(err);
        res.json(song);
    });
};

exports.delete_a_song = function (req, res) {

    Song.remove({
        name: req.params.songName
    }, function (err, song) {
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
    let verseId = await generateNewId("v", Verse);
    Song.findOne({ name: req.params.songName }, function (err, song) {
        if (err) {
            res.send(err);
        }
        Song.findOneAndUpdate({ name: req.params.songName }, {
            verses: song.verses.concat(verseId)
            
        }, function(err, song) {
            if (err) {
                res.send(err);
            }

            var newVerse = new Verse({
                id: verseId, 
                text: req.body.text,
                type: req.body.type,
                songName: req.params.songName
            });
            newVerse.save(function(err, verse) {
                if (err) {
                    res.send(err);
                }
                res.json(verse);
            });
        });
    });
};

exports.download_a_song = async function(req, res) {
    let songName = req.params.songName;
    let allVerses = await Verse.find({songName: songName});

    res.writeHead(200, {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-disposition': 'attachment; filename=' + songName + '.pptx'
    });

    const exporter = new PPTXExporter();
    await exporter.addSong(songName, allVerses);
    await exporter.exportPPTX(res);
    
}

exports.download_songs = async function(req, res) {
    let songNames = req.body.songs;

    const exporter = new PPTXExporter();

    await songNames.forEach(async s => {
        let allVerses = await Verse.find({songName: s});
        await exporter.addSong(s, allVerses);
    });

    res.writeHead(200, {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-disposition': 'attachment; filename=' + songName[0] + '.pptx'
    });

    await exporter.exportPPTX(res);

}

exports.create_a_chorus = async function(req, res) {
    verseId = await generateNewId("v", Verse);
    Song.findOne({ name: req.params.songName }, function (err, song) {
        if (err) {
            res.send(err);
        }
        Song.findOneAndUpdate({ name: req.params.songName }, {
            chorus: verseId
            
        }, function(err, song) {
            if (err) {
                res.send(err);
            }

            var newVerse = new Verse({
                id: verseId, 
                text: req.body.text,
                type: req.body.type,
                songName: req.params.songName
            });
            newVerse.save(function(err, verse) {
                if (err) {
                    res.send(err);
                }
                res.json(verse);
            });
        });
    });
};

exports.get_all_lists = async function(req, res) {
    const songLists = await SongList.find({});
    res.json(songLists);
}

exports.get_a_list = async function(req, res) {
    const songList = await SongList.findOne({id: req.params.listId});
    res.json(songList);
}

exports.create_a_list = async function(req, res) {
    let songListObj = {...req.body, id: await generateNewId("s", SongList)};
    let newList = new SongList(songListObj);
    let list = await newList.save();

    res.json(newList);
}

exports.update_a_list = async function(req, res) {
    let newList = await SongList.findOneAndUpdate({id: req.params.listId}, {songs: req.body.songs}, { new: true });

    res.json(newList);
}

exports.delete_a_list = async function(req, res) {
    SongList.findOneAndRemove({id: req.params.listId}).then(
        res => { res.json({message: "deleted"}) },
        err => { res.send(err) }
    );
    
}

const generateNewId = async (prefix, DBSchema, idName = "id") => {
    let index = prefix + "0";
    let maxIndex = await DBSchema.findOne({}, {}, {sort: {id: -1}});
    if(maxIndex !== null) {
        let maxId = parseInt(maxIndex[idName].replace(prefix, ""), 10) + 1;
        index = prefix + maxId;    
    }
    return index;
}