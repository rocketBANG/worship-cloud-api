require('dotenv').config();

const songRoutes = require('./songRoutes');
const verseRoutes = require('./verseRoutes');
const userRoutes = require('./userRoutes');

module.exports = function(app) {
    songRoutes(app);
    verseRoutes(app);
    userRoutes(app);
};