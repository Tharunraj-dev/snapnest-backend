import User from "./../models/user.model.js";

const chatSocket = (chatSocket) => {
  return (socket) => {
    console.log("Connected!");

    Socket.on("disconnect", () => {
      console.log("Disconnected!");
    });
  };
};

export default chatSocket;
