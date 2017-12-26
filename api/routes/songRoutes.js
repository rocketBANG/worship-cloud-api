var song = require('../controllers/songController');

module.exports = function (app) {   
      
    app.route('/songs')
        .get(song.list_all_songs)
        .post(song.create_a_song)
        .delete(song.delete_all_songs);


    app.route('/songs/:songName')
        .get(song.read_a_song)
        .put(song.update_a_song)
        .delete(song.delete_a_song)
        .patch(song.update_a_song);
        
    app.route('/songs/:songName/verses')
        .get(song.list_all_verses)
        .post(song.create_a_verse);
};
