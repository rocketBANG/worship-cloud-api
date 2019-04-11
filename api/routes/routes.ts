require('dotenv').config();

const songRoutes = require('./songRoutes');
const userRoutes = require('./userRoutes');

export const asyncRoute = f => (req, res, next) => {
    return Promise.resolve(f(req, res, next)).catch(next);
};  

export function routes(app) {
    songRoutes(app);
    userRoutes(app);
};