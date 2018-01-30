var song = require('../controllers/songController');
var baseUrl = process.env.BASE_URL;

module.exports = function (app) {   

    app.route(baseUrl + '/songs')
        .get(song.list_all_songs)
        .post(song.create_a_song)
        .delete(song.delete_all_songs);


    app.route(baseUrl + '/songs/:songName')
        .get(song.read_a_song)
        .put(song.update_a_song)
        .delete(song.delete_a_song)
        .patch(song.update_a_song);
        
    app.route(baseUrl + '/songs/:songName/verses')
        .get(song.list_all_verses)
        .post(song.create_a_verse);

    app.route(baseUrl + '/songs/:songName/chorus')
        .post(song.create_a_chorus);

};
