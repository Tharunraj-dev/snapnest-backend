import http from "http";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import User from "./models/user.model.js";
import authRoutes from "./route/auth.route.js";


dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET_KEY));
app.use(
  cors({
    origin: (origin, callBack) => {
      if (!origin) return callBack(null, true);
      let isAllowedOrigin =
        origin.startsWith("http://localhost") ||
        origin === process.env.CLIENT_URL;
      if (isAllowedOrigin) return callBack(null, true);
      return callBack(new Error("Cannot access the server"));
    },
    credentials: true,
  }),
);

const socket = new Server(server, {
  cors: {
    origin: (origin, callBack) => {
      if (!origin) return callBack(null, true);
      let isAllowedOrigin =
        origin.startsWith("http://localhost") ||
        origin === process.env.CLIENT_URL;
      if (isAllowedOrigin) return callBack(null, true);
      return callBack(new Error("Cannot access the server"));
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const chatsSocket = socket.of("/chats");
app.use("/api/auth/", authRoutes);

server.listen(process.env.PORT, () => {
  console.log("Running in the port");
});
