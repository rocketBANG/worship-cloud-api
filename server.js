var express = require('express');
var app = express();
var port = process.env.PORT || 3500;
var router = express.Router();
var mongoose = require('mongoose');
var Task = require('./api/models/models'); //created model loading here
var bodyParser = require('body-parser');
var fs = require('fs');

var {authFile} = JSON.parse(fs.readFileSync('setup.json', 'utf8'));
var {user, pass} = JSON.parse(fs.readFileSync(authFile, 'utf8'));

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://' + user + ':' + pass + '@worshipcloud-shard-00-02-trnrb.mongodb.net:27017/songs?ssl=true&authSource=admin', {useMongoClient: true});

 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, DELETE, HEAD, POST, PATCH");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})


var routes = require('./api/routes/routes'); //importing route
routes(app); //register the route

app.listen(port, function () {
    console.log('Example app listening on port 3500!');
});  

module.exports = router;
