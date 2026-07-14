import User from "../models/user.model.js";
import chats from "../models/chats.model.js";

export const getChatList = async (req, res) => {
  const { userId } = req;
  try {
    const List = await User.findById(userId).select("chatList");
    if (List == null)
      return res.status(404).json({ message: "Chat not Found!" });
    const { chatList } = List;
    for (let i = 0; i < chatList.length; i++) {
      let senderInfo = await User.findOne({ uid: chatList[i].senderId });
      chatList[i] = {
        ...chatList[i],
        senderName: senderInfo.userName,
        profileURL: senderInfo.profileURL,
      };
    }
    res.status(200).json(chatList);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something Went Wrong!" });
  }
};