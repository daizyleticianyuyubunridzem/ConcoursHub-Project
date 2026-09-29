import session from "express-session";
import MongoStore from "connect-mongo";

// Configure and export the application session middleware
const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || "concourshub-secret",

    resave: false,
    saveUninitialized: false,

    // Store sessions in MongoDB instead of server memory
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
    }),

    // Configure the browser session cookie
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
    },
});

export default sessionMiddleware;