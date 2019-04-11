var song = require('../controllers/songController');
const { getEnvValue } = require("../utils/EnvironmentManager");
let baseUrl = getEnvValue("BASE_URL") || '';
import { asyncRoute } from "./routes";

module.exports = function (app) {   

    app.route(baseUrl + '/songs')
        .get(asyncRoute(song.list_all_songs))
        .post(asyncRoute(song.create_a_song))
        .delete(asyncRoute(song.delete_all_songs));

    app.route(baseUrl + '/songpptx/:songId')
        .get(asyncRoute(song.download_a_song));

    app.route(baseUrl + '/songpptx')
        .post(asyncRoute(song.download_songs));

    app.route(baseUrl + '/songs/:songId')
        .get(asyncRoute(song.read_a_song))
        .put(asyncRoute(song.update_a_song))
        .delete(asyncRoute(song.delete_a_song))
        .patch(asyncRoute(song.update_a_song));
        
    app.route(baseUrl + '/songs/:songId/verses')
        .get(asyncRoute(song.list_all_verses))
        .post(asyncRoute(song.create_a_verse));

    app.route(baseUrl + '/songs/:songId/verses/:verseId')
        .get(asyncRoute(song.read_a_verse))
        .put(asyncRoute(song.update_a_verse))
        .delete(asyncRoute(song.delete_a_verse))
        .patch(asyncRoute(song.update_a_verse));

    app.route(baseUrl + '/songlists')
        .get(asyncRoute(song.get_all_lists))
        .post(asyncRoute(song.create_a_list));
        
    app.route(baseUrl + '/songlists/:listId')
        .get(asyncRoute(song.get_a_list))
        .patch(asyncRoute(song.update_a_list))
        .delete(asyncRoute(song.delete_a_list));
};
