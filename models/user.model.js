import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { v7 as uuidv7 } from "uuid";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      require: true,
      unique: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    uid: {
      type: String,
      default:uuidv7,
      require: true,
    },
    role:{
      type:String,
      default:"user",
    },
    profileURL :{
      type: String,
      default: ""
    }
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function() {
  if (!this.isModified("password")) return;
  let saltValue = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, saltValue);
});

const User = mongoose.model('Users',userSchema);

export default User;
