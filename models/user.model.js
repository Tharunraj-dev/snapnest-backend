import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { v7 as uuidv7 } from "uuid";

const chatListSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
  },
  senderId: {
    type: String,
    required: true,
  },
});

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    uid: {
      type: String,
      unique: true,
      index: true,
      default: uuidv7,
    },
    role: {
      type: String,
      default: "user",
    },
    profileURL: {
      type: String,
      default: "",
    },
    publicId: {
      type: String,
      default: "",
    },
    followers: {
      type: String,
      default: "0",
    },
    following: {
      type: String,
      default: "0",
    },
    chatList: {
      type: [chatListSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  let saltValue = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, saltValue);
});

const User = mongoose.model("Users", userSchema);

export default User;
