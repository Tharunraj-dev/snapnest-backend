import mongoose from "mongoose";
import { v7 as uuidv7 } from "uuid";

const messageSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  senderId: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  isEdited: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const chatSchema = new mongoose.Schema({
  chatId: {
    type: String,
    default: uuidv7
  },
  chats: {
    type: [messageSchema],
    default: [],
  },
});

const chats = mongoose.model("Chats", chatSchema);

export default chats;