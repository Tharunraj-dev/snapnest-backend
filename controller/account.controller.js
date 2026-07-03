import User from "./../models/user.model.js";

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(401).json({ message: "User not found" });
    res.clearCookie("token", token, {
      httpOnly: true,
      signed: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "protection",
      maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 3 * 60 * 60 * 1000,
    });
    return res.status(200).json({ message: "User Deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internet Server Error" });
  }
};
