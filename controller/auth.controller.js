import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "./../models/user.model.js";

export const Login = async (req, res) => {
  try {
    const { userName, password, rememberMe } = req.body;
    const user = await User.findOne({
      $or: [{ userName }, { email: userName }],
    })
      .select("-chatList -following -followers -publicId")
      .lean();
    if (!user)
      return res.status(404).json({ message: "Invalid username or password" });
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res.status(401).json({ message: "Invalid username or password" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: rememberMe ? "7d" : "3h",
    });

    res.cookie("uid", user.uid, {
      httpOnly: false,
      sameSite: "lax",
      maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 3 * 60 * 60 * 1000,
    });
    res.cookie("token", token, {
      httpOnly: true,
      signed: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "protection",
      maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 3 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      message: "Successfully received",
      userName: user.userName,
      email: user.email,
      role: user.role,
      uid: user.uid,
      profileURL: user.profileURL,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server" });
  }
};

export const Signup = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    const isExistingUser = await User.findOne({
      $or: [{ userName }, { email }],
    })
      .select("userName -_id")
      .lean();
    if (isExistingUser) {
      return res.status(409).json({
        message: `${isExistingUser.userName === userName ? "Username" : "email"} is arleady in use!`,
      });
    }
    const user = await User.create({ userName, email, password });
    res.status(200).json({ message: "User Created Successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const Logout = (req, res) => {
  res.clearCookie("token", token, {
    httpOnly: true,
    signed: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "protection",
    maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 3 * 60 * 60 * 1000,
  });
  res.status(200).json({ message: "Successfully Logged out" });
};
