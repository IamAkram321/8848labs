import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import helmet from "helmet";
import passport from "passport";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { pool } from "@workspace/db";

import "./routes/auth";

const app: Express = express();

app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  })
);

// 1. Get origins from optional ALLOWED_ORIGINS env variable
const customAllowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
      .map((url) => url.trim().replace(/\/$/, ""))
      .filter(Boolean)
  : [];

// 2. Combine defaults + FRONTEND_URL + Vercel deployment + custom origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://8848labs.pathaksons.com",
  "https://8848labs-8848labs.vercel.app",
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL.trim().replace(/\/$/, "")] : []),
  ...customAllowedOrigins,
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server, Postman, or local curl without origin header
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.trim().replace(/\/$/, "");

      if (allowedOrigins.includes(normalizedOrigin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PgSession = connectPgSimple(session);

app.use(
  session({
    store: new PgSession({
      pool,
      tableName: "session",
      createTableIfMissing: false,
    }),

    secret: process.env.SESSION_SECRET ?? "fallback-dev-secret-change-me",

    resave: false,
    saveUninitialized: false,

    proxy: true,
    name: "connect.sid",

    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", router);

export default app;