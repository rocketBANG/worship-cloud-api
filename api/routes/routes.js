var songRoutes = require('./songRoutes');
var verseRoutes = require('./verseRoutes');
require('dotenv').config();

module.exports = function(app) {
    songRoutes(app);
    verseRoutes(app);
}