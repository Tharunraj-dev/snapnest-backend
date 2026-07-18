import chats from "../models/chats.model.js";
import User from "./../models/user.model.js";

const chatSocketListener = (chatSocket) => {
  return (socket) => {
    console.log("connected!");

    socket.on("join_chat", async ({ chatId, senderId }) => {
      try {
        const senderName = await User.findOne({ uid: senderId })
          .select("userName -_id")
          .lean();
        if (!senderName) throw new Error("User Not Exist");
        let chatMessages = await chats
          .findOne({ chatId })
          .select("chatId chats")
          .lean();
        if (!chatMessages) {
          chatMessages = await chats.create({ chats: [] });
          const userData = await User.findByIdAndUpdate(
            socket.userid,
            {
              $push: {
                chatList: {
                  senderId,
                  chatId: chatMessages.chatId,
                },
              },
            },
            { new: true },
          )
            .select("chats -_id")
            .lean();
          if (!userData) throw new Error("Something Went Wrong!");
        }
        socket.chatId = chatMessages.chatId;
        socket.join(chatId);
        chatSocket.to(socket.id).emit("set_sender_info", {
          name: senderName.userName,
          chatId: chatMessages.chatId,
        });
        chatSocket
          .to(socket.id)
          .emit("prev_chat", { chats: chatMessages.chats });
      } catch (error) {
        console.log(error);
        chatSocket.to(socket.id).emit("error_message", {
          message: error.message || "Error in joining the Room!",
        });
      }
    });

    socket.on("send_message", async ({ id, content, senderId, timestamp }) => {
      if (!socket.chatId) return;
      try {
        await chats.findOneAndUpdate(
          { chatId: socket.chatId },
          {
            $push: {
              chats: {
                id,
                content,
                senderId,
                timestamp,
              },
            },
          },
          { new: true },
        ).select("chats -_id").sort({createAt:-1}).skip(0).limit(5).lean();
        if (!message) throw new Error("Error in Sending the Message");
        socket
          .to(socket.chatId)
          .emit("receive_message", { id, content, senderId, timestamp });
      } catch (error) {
        console.log(error);
        chatSocket.to(socket.id).emit("error_message", {
          message: error.message || "Error in Sending the Message!",
        });
      }
    });

    socket.on("edit_message", async ({ messageId, content }) => {
      if (!socket.chatId) return;
      try {
        const message = await findOneAndUpdate(
          { chatId: socket.chatId, "chats.id": messageId },
          {
            $set: {
              "chats.$.content": content,
              "chats.$.isEdited": true,
            },
          },
        );
        if (!message) throw new Error("Error in Deleting the Message!");
        socket.to(socket.chatId).emit("error_message", { messageId, context });
      } catch (error) {
        console.log(error);
        chatSocket.to(socket.id).emit("error_message", {
          message: error.message || "Error in Editing the Message",
        });
      }
    });

    socket.on("delete_message", async ({ messageId, senderName }) => {
      if (!socket.chatId) return;
      try {
        const message = await findOneAndUpdate(
          { chatId: socket.chatId, "chats.id": messageId },
          {
            $set: {
              "chats.$.content": content,
              "chats.$.isDeleted": true,
            },
          },
        );
        if (!message) throw new Error("Error in Deleting the Message!");
        socket
          .to(socket.chatId)
          .emit("delete_message", { id: messageId, senderName });
      } catch (error) {
        console.log(error);
        chatSocket.to(socket.id).emit("error_message", {
          message: error.message || "Error in Sending the Message",
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected");
    });
  };
};

export default chatSocketListener;
