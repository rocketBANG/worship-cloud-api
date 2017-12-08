var verse = require('../controllers/verseController');

module.exports = function (app) {   
      
    app.route('/verses')
        .get(verse.list_all_verses)
        .post(verse.create_a_verse)
        // .delete(verse.delete_all_verses);


    app.route('/verses/:verseId')
        .get(verse.read_a_verse)
        .put(verse.update_a_verse)
        .delete(verse.delete_a_verse)
        .patch(verse.update_a_verse);
};
