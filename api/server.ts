import { ifError, ok } from "assert";
import { json, urlencoded } from "body-parser";
import connectMongo from "connect-mongodb-session";
import dotenv from "dotenv";
import express, { NextFunction, Router } from "express";
import session from "express-session";
import { connect, set } from "mongoose";
import * as mongoose from "mongoose";
import socketIo from "socket.io";
import { routes } from "./routes/routes";
import { SocketManager } from "./SocketManager";
import { getObj } from "./UserManager";
import { getEnvValue } from "./utils/EnvironmentManager"
import expressValidator = require("express-validator");
import { RouteAuth } from "./routes/RouteAuth";
require('./models/models');

dotenv.load();
const app = express();
const port = getEnvValue("PORT") || 3500;
const router = Router();

const MongoDBStore = connectMongo(session);

const store = new MongoDBStore({
  uri: "mongodb://" +
    getEnvValue("DBUSER") +
    (getEnvValue("DBUSER") && ":") +
    getEnvValue("DBPASS") + "@" +
    getEnvValue("DBURL") + "/session" +
    getEnvValue("DBARGS") ,
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
    secret: getEnvValue("SECRET"),
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
app.use(expressValidator());
app.use(urlencoded({ extended: true }));
app.use(json());

(<any>mongoose.Promise) = Promise;
set("useCreateIndex", true);
connect("mongodb://" +
    getEnvValue("DBUSER") +
    (getEnvValue("DBUSER") && ":") +
    getEnvValue("DBPASS") + "@" +
    getEnvValue("DBURL") + "/" +
    getEnvValue("DBCOLLECTION") +
    getEnvValue("DBARGS"),
    { useNewUrlParser: true });


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

const uncheckedPaths = ["/login", "/users"];
const uncheckedMethods = ["OPTIONS"];

const baseUrl = getEnvValue("BASE_URL") || "";

app.use(RouteAuth);

routes(app); // register the route

const server = app.listen(port, function() {
    console.log("Example app listening on port 3500!");
});

getObj().Init();

const io = socketIo().listen(server);
SocketManager.getManager().setSocketIO(io);

export default router;
