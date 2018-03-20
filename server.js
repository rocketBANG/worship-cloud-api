require('dotenv').load();
var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var Task = require('./api/models/models'); //created model loading here
var bodyParser = require('body-parser');
var socketIo = require('socket.io');
var { SocketManager } = require('./api/SocketManager');

var app = express();
var port = process.env.PORT || 3500;
var router = express.Router();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://' + process.env.DBUSER + (process.env.DBUSER && ':') + process.env.DBPASS + '@' + process.env.DBURL, {useMongoClient: true});
 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const origins = ["https://worshipcloud.azurewebsites.net", "http://localhost:3000"];

app.use(function(req, res, next) {
    let origin = req.headers.origin && origins.indexOf(req.headers.origin.toLowerCase()) > - 1 
        ? req.headers.origin 
        : origins[0];
    console.log(origin);
    res.header("Access-Control-Allow-Origin", origin);
    next();
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Methods", "GET, PUT, DELETE, HEAD, POST, PATCH");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!')
});

var routes = require('./api/routes/routes'); //importing route
routes(app); //register the route

let server = app.listen(port, function () {
    console.log('Example app listening on port 3500!');
});  

let io = socketIo().listen(server);
SocketManager.getManager().setSocketIO(io);


module.exports = router;
