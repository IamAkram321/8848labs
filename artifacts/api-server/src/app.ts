import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import pinoHttp from "pino-http";
import path from "node:path";
import router from "./routes";
import { logger } from "./lib/logger";

// Import auth module — registers passport strategies as a side-effect
import "./routes/auth";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  })
);

// Trust proxy so secure cookies work behind Replit's reverse proxy
app.set("trust proxy", 1);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET ?? "fallback-dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/uploads", express.static(path.resolve(process.cwd(), "uploads")));

app.use("/api", router);

export default app;