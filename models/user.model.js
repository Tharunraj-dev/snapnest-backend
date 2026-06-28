import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    user_name: {
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
    user_id: {
      type: String,
      require: true,
    },
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
