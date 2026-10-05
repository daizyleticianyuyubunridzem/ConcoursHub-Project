import session from "express-session";
import MongoStore from "connect-mongo";

// Configure and export the application session middleware
const sessionMiddleware = session({
    secret:  process.env.SESSION_SECRET!,

    resave: false,
    saveUninitialized: false,

    // Store sessions in MongoDB instead of server memory
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
    }),

    // Configure the browser session cookie
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60,
    },
});

export default sessionMiddleware;