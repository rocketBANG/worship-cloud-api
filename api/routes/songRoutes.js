module.exports = function (app) {
    var song = require('../controllers/songController');

    // todoList Routes
    app.route('/songs')
        .get(song.list_all_songs)
        .post(song.create_a_song);


    app.route('/songs/:songId')
        .get(song.read_a_song)
        .put(song.update_a_song)
        .delete(song.delete_a_song);
};
