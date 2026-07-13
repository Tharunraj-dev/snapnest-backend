import express from "express";
import { getChatList } from "../controller/chat.controller.js";

const router = express.Router();

router.get("/chat-list", getChatList);

export default router;