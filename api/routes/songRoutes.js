var song = require('../controllers/songController');
let baseUrl = process.env.BASE_URL || '';

module.exports = function (app) {   

    app.route(baseUrl + '/songs')
        .get(song.list_all_songs)
        .post(song.create_a_song)
        .delete(song.delete_all_songs);

    app.route(baseUrl + '/songpptx/:songName')
        .get(song.download_a_song);

    app.route(baseUrl + '/songpptx')
        .post(song.download_songs);

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

    app.route(baseUrl + '/songlists')
        .get(song.get_all_lists)
        .post(song.create_a_list);
        
    app.route(baseUrl + '/songlists/:listId')
        .get(song.get_a_list)
        .patch(song.update_a_list)
        .delete(song.delete_a_list);
};
