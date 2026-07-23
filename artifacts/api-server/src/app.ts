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

// Registers passport strategies
import "./routes/auth";

const app: Express = express();

// Security headers (X-Content-Type-Options, X-Frame-Options, a reasonable
// default Content-Security-Policy, etc.). This app serves a JSON API only —
// no server-rendered HTML — so the defaults are safe with no extra tuning.
app.use(helmet());

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

// Required when running behind Render's proxy
app.set("trust proxy", 1);

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.FRONTEND_URL!,
    ],
    credentials: true,
  })
);

app.use(cookieParser());

// Session
const PgSession = connectPgSimple(session);

app.use(
  session({
    store: new PgSession({
      pool,
      tableName: "session",
      createTableIfMissing: true,
    }),

    secret:
      process.env.SESSION_SECRET ??
      "fallback-dev-secret-change-me",

    resave: false,
    saveUninitialized: false,

    proxy: true,
    name: "connect.sid",

    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;