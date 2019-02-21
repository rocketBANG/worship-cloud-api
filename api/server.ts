import { ifError, ok } from "assert";
import { json, urlencoded } from "body-parser";
import connectMongo from "connect-mongodb-session";
import dotenv from "dotenv";
import express, { NextFunction, Router } from "express";
import session from "express-session";
import { connect, set } from "mongoose";
import * as mongoose from "mongoose";
import socketIo from "socket.io";
import routes from "./routes/routes";
import { SocketManager } from "./SocketManager";
import { getObj } from "./UserManager";
require('./models/models');

dotenv.load();
const app = express();
const port = process.env.PORT || 3500;
const router = Router();

const MongoDBStore = connectMongo(session);

const store = new MongoDBStore({
  uri: "mongodb://" +
    process.env.DBUSER +
    (process.env.DBUSER && ":") +
    process.env.DBPASS + "@" +
    process.env.DBURL + "/session" +
    process.env.DBARGS ,
  collection: "mySessions",
});

store.on("connected", () => {
  store.client; // The underlying MongoClient object from the MongoDB driver
});

// Catch errors
store.on("error", function(error) {
  ifError(error);
  ok(false);
});

let sess: session.SessionOptions = {
    secret: "verysecretWorshipCloud",
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30,  // 30 Days
    },
    store,
    resave: false,
    saveUninitialized: true,
};

if (app.get("env") === "production") {
    app.set("trust proxy", 1); // trust first proxy
    sess.cookie.secure = true; // serve secure cookies
}

app.use(session(sess));

(<any>mongoose.Promise) = Promise;
set("useCreateIndex", true);
connect("mongodb://" +
    process.env.DBUSER +
    (process.env.DBUSER && ":") +
    process.env.DBPASS + "@" +
    process.env.DBURL + "/" +
    process.env.DBCOLLECTION +
    process.env.DBARGS,
    { useNewUrlParser: true });

app.use(urlencoded({ extended: true }));
app.use(json());

const origins = ["https://worshipcloud.azurewebsites.net", "http://localhost:3000"];

app.use((req, res, next) => {
    let origin = req.headers.origin instanceof Array ? req.headers.origin[0] : req.headers.origin;
    origin = origin && origins.indexOf(origin.toLowerCase()) > - 1
        ? origin
        : origins[0];
    res.header("Access-Control-Allow-Origin", origin);
    next();
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Methods", "GET, PUT, DELETE, HEAD, POST, PATCH");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, auth-token");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.use((err: any, req: express.Request, res: express.Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json("Something broke!");
});

const uncheckedPaths = ["/login"];
const uncheckedMethods = ["OPTIONS"];

const baseUrl = process.env.BASE_URL || "";

app.use(async function(req, res, next) {
    if (uncheckedPaths.findIndex((p) => req.path.startsWith(baseUrl + p)) > -1) {
        next();
        return;
    }
    if (req.method === "OPTIONS") {
        res.json();
        return;
    }
    let user = await getObj().VerifyUser(req.headers["auth-token"]);
    if (user === null) {
        const loginCookie = req.session.worship_login;
        const token = loginCookie && loginCookie.split("|")[0];
        user = await getObj().VerifyUser(token);
        if (user === null) {
            res.statusCode = 401;
            res.json();
            return;
        }
    }
    next();
});

routes(app); // register the route

const server = app.listen(port, function() {
    console.log("Example app listening on port 3500!");
});

getObj().Init();

const io = socketIo().listen(server);
SocketManager.getManager().setSocketIO(io);

export default router;
