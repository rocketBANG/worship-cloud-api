require('dotenv').config();

const songRoutes = require('./songRoutes');
const verseRoutes = require('./verseRoutes');

module.exports = function(app) {
    songRoutes(app);
    verseRoutes(app);
};