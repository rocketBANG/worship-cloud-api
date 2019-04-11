import express = require("express");
import { asyncRoute } from "./routes";

const userController = require('../controllers/userController');
const { getEnvValue } = require("../utils/EnvironmentManager");
let baseUrl = getEnvValue("BASE_URL") || '';

module.exports = function (app: express.Application) {   
    app.route(baseUrl + '/settings/:username')
        .get(asyncRoute(userController.getSettings))
        .patch(asyncRoute(userController.patchSettings));
    app.route(baseUrl + '/login/:username')
        .post(asyncRoute(userController.loginUser))
        .patch(asyncRoute(userController.updatePass));
    app.route(baseUrl + '/logincookie')
        .post(asyncRoute(userController.loginCookie))
        // .patch(asyncRoute(userController.updatePass));
    app.route(baseUrl + '/logout')
        .post(asyncRoute(userController.logoutCookie));
    app.route(baseUrl + '/users/:username')
        .post(asyncRoute(userController.createUser));
}