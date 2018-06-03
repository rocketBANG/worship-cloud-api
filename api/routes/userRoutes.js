const userController = require('../controllers/userController');
let baseUrl = process.env.BASE_URL || '';

module.exports = function (app) {   
    app.route(baseUrl + '/settings/:username')
        .get(userController.getSettings)
        .patch(userController.patchSettings);
        app.route(baseUrl + '/login/:username')
        .post(userController.loginUser)
        // .patch(userController.updatePass);
    app.route(baseUrl + '/logincookie')
        .post(userController.loginCookie)
        // .patch(userController.updatePass);
}