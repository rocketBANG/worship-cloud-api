require('dotenv').load();
var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var Task = require('./api/models/models'); //created model loading here
var bodyParser = require('body-parser');
var socketIo = require('socket.io');
var { SocketManager } = require('./api/SocketManager');
// const cookieParser = require('cookie-parser')
var session = require('express-session')

var app = express();
var port = process.env.PORT || 3500;
var router = express.Router();

var MongoDBStore = require('connect-mongodb-session')(session);
 
var store = new MongoDBStore({
  uri: 'mongodb://' + process.env.DBUSER + (process.env.DBUSER && ':') + process.env.DBPASS + '@' + process.env.DBURL + '/session' + process.env.DBARGS ,
  collection: 'mySessions'
});
 
store.on('connected', function() {
  store.client; // The underlying MongoClient object from the MongoDB driver
});
 
// Catch errors
store.on('error', function(error) {
  assert.ifError(error);
  assert.ok(false);
});


var app = express()
var sess = {
    secret: 'verysecretWorshipCloud',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7  // 1 week
    },
    store: store,
    resave: false,
    saveUninitialized: true
}

if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess))

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://' + process.env.DBUSER + (process.env.DBUSER && ':') + process.env.DBPASS + '@' + process.env.DBURL + '/' + process.env.DBCOLLECTION + process.env.DBARGS, 
{ useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const origins = ["https://worshipcloud.azurewebsites.net", "http://localhost:3000"];

app.use(function (req, res, next) {
    let origin = req.headers.origin && origins.indexOf(req.headers.origin.toLowerCase()) > - 1
        ? req.headers.origin
        : origins[0];
    res.header("Access-Control-Allow-Origin", origin);
    next();
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Methods", "GET, PUT, DELETE, HEAD, POST, PATCH");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, auth-token");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).json('Something broke!')
});

// app.use(cookieParser())
// var expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
// app.use(session({
//     name: 'session',
//     keys: ['key1', 'key2'],
//     cookie: {
//         secure: true,
//         httpOnly: true,
//         domain: 'example.com',
//         path: 'foo/bar',
//         expires: expiryDate
//     }
// }))

const uncheckedPaths = ["/login"];
const uncheckedMethods = ["OPTIONS"];

const UserManager = require('./api/UserManager');
let baseUrl = process.env.BASE_URL || '';

app.use(async function (req, res, next) {
    if (uncheckedPaths.findIndex(p => req.path.startsWith(baseUrl + p)) > -1) {
        next();
        return;
    }
    if (req.method === "OPTIONS") {
        res.json();
        return;
    }
    let user = await UserManager.getObj().VerifyUser(req.headers["auth-token"]);
    if (user === null) {
        let loginCookie = req.session.worship_login;
        let token = loginCookie && loginCookie.split('|')[0];
        user = await UserManager.getObj().VerifyUser(token);
        if (user === null) {
            res.statusCode = 401;
            res.json();
            return;
        }
    }
    next();
});

var routes = require('./api/routes/routes'); //importing route
routes(app); //register the route

let server = app.listen(port, function () {
    console.log('Example app listening on port 3500!');
});

UserManager.getObj().Init();


let io = socketIo().listen(server);
SocketManager.getManager().setSocketIO(io);


module.exports = router;
