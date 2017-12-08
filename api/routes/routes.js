var songRoutes = require('./songRoutes');
var verseRoutes = require('./verseRoutes');

module.exports = function(app) {
    songRoutes(app);
    verseRoutes(app);
}