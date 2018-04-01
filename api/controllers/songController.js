var mongoose = require('mongoose');
var Song = mongoose.model('Songs');
var Verse = mongoose.model('Verses');
var {SocketManager} = require('../SocketManager');
const fs = require('fs');

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

exports.create_a_verse = function(req, res) {
    Verse.findOne({}, {}, { sort: {id : -1 }}, function(err, verse) {
        let verseId = "v0000";
        if(verse != null) {
            let maxId = parseInt(verse.id.replace("v", ""), 10) + 1;
            verseId = "v" + String('00000'+maxId).slice(-4);
        }
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
    })
};

exports.download_a_song = async function(req, res) {
    let allVerses = await Verse.find({songName: req.params.songName});

    let titleSlideContents = fs.readFileSync('docs/pptx-title-slide.xml').toString();
    let verseSlideContents = fs.readFileSync('docs/pptx-word-slide.xml').toString();
    // console.log(titleSlideContents);
 
    let defaultParagraph = fs.readFileSync('docs/pptx-paragraph.xml').toString();

    let slides = [];

    allVerses.forEach((verse, i) => {
        let paragraphs = "";
        let slideContents = verseSlideContents;
        if(i === 0) {
            slideContents = titleSlideContents.replace("%TITLE%", req.params.songName);
        }
        
        verse.text.split("\n").forEach(line => {
            if(line !== "") {
                paragraphs += defaultParagraph.replace("%WORD%", line);
            }
        });
        let slide = slideContents.replace("%PARAGRAPHS%", paragraphs);
        slides.push(slide);
        fs.writeFileSync("tmp/slide" + (i + 1) + ".xml", slide);
    });



    
}

exports.create_a_chorus = function(req, res) {
    Verse.findOne({}, {}, { sort: {id : -1 }}, function(err, verse) {
        let verseId = "v0";
        if(verse != null) {
            let maxId = parseInt(verse.id.replace("v", ""), 10) + 1;
            verseId = "v" + maxId;    
        }
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
    })
};
