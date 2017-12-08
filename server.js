var express = require('express');
var app = express();
var port = process.env.PORT || 3500;
var router = express.Router();
var mongoose = require('mongoose');
var Task = require('./api/models/songModel'); //created model loading here
var bodyParser = require('body-parser');
var {user, pass} = require('./auth');

mongoose.Promise = global.Promise;
let mongooseOptions = {
    useMongoClient: true,
}
mongoose.connect('mongodb://' + user + ':' + pass + '@worshipcloud-shard-00-02-trnrb.mongodb.net:27017/songs?ssl=true&authSource=admin');

 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/songRoutes'); //importing route
routes(app); //register the route

app.listen(port, function () {
    console.log('Example app listening on port 3500!');
});

module.exports = router;
