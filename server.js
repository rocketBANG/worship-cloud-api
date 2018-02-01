//@ts-check

require('dotenv').load();
var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var Task = require('./api/models/models'); //created model loading here
var bodyParser = require('body-parser');
var socketIo = require('socket.io');
var { SocketManager } = require('./api/SocketManager');

let io = socketIo(http.createServer(app));
const socketPort = 8000;
io.listen(socketPort);
SocketManager.getManager().setSocketIO(io);

var app = express();
var port = process.env.PORT || 3500;
var router = express.Router();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://' + process.env.DBUSER + ':' + process.env.DBPASS + '@worshipcloud-shard-00-02-trnrb.mongodb.net:27017/songs?ssl=true&authSource=admin', {useMongoClient: true});
 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Methods", "GET, PUT, DELETE, HEAD, POST, PATCH");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", "true");
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
