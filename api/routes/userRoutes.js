const userController = require('../controllers/userController');
let baseUrl = process.env.BASE_URL || '';

module.exports = function (app) {   
    app.route(baseUrl + '/settings/:username')
        .get(userController.getSettings)
        .patch(userController.patchSettings);

}