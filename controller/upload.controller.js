import cloudinary from "../config/cloudinary.js";
import User from "./../models/user.model.js";

export const uploadProfile = async (req, res) => {
  if (!req.file) return res.status(404).json({ message: "No file uploaded" });
  const { userId } = req;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const upload = await cloudinary.uploader.upload(req.file.path, {
      folder: "snapnest/profile",
      public_id: `${user.userName}-${user.uid}`,
      overwrite: true,
    });
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profileURL: upload.secure_url,
        publicId: upload.public_id,
      },
      { new: true },
    );
    console.log(updatedUser);

    return res.status(200).json({
      message: "File uploaded successfully",
      profileURL: updatedUser.profileURL,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProfile = async (req, res) => {
  const { userId } = req;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const upload = await cloudinary.uploader.destroy(user.publicId);
    if (upload.result !== "ok")
      return res.status(500).json({ message: "Failed to delete file" });
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileURL: "", publicId: "" },
      { new: true },
    );
    return res.status(200).json({
      message: "File deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};  
