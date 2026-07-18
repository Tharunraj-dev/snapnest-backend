import User from "../models/user.model.js";
import chats from "../models/chats.model.js";

export const getChatList = async (req, res) => {
  const { userId } = req;
  try {
    const List = await User.findById(userId).select("chatList").lean();
    if (List == undefined)
      return res.status(404).json({ message: "Chat not Found!" });
    let chatList = List.chatList ?? [];
    let chatListWithInfo = await Promise.all(
      chatList.map(async (chat) => {
        let senderInfo = await User.findOne({ uid: chat.senderId })
          .select("userName profileURL -_id")
          .lean();
        if (!senderInfo) return null;
        return {
          ...chat,
          senderName: senderInfo?.userName,
          profileURL: senderInfo?.profileURL,
        };
      }),
    );
    chatListWithInfo = chatListWithInfo.filter((element) => element !== null);
    chatListWithInfo.push({
      profileURL: "",
      senderName: "jhvhvhv",
      senderId: "",
      chatId: "",
    });
    res.status(200).json(chatListWithInfo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something Went Wrong!" });
  }
};
