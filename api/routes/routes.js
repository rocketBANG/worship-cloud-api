require('dotenv').config();

const songRoutes = require('./songRoutes');
const userRoutes = require('./userRoutes');

module.exports = function(app) {
    songRoutes(app);
    userRoutes(app);
};