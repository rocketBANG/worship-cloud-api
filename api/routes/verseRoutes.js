var verse = require('../controllers/verseController');
let baseUrl = process.env.BASE_URL;

module.exports = function (app) {   
      
    app.route(baseUrl + '/verses')
        .get(verse.list_all_verses)
        .post(verse.create_a_verse);
        // .delete(verse.delete_all_verses);


    app.route(baseUrl + '/verses/:verseId')
        .get(verse.read_a_verse)
        .put(verse.update_a_verse)
        .delete(verse.delete_a_verse)
        .patch(verse.update_a_verse);
};
