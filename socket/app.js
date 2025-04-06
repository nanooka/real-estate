// import { Server } from "socket.io";
// // import "dotenv/config";

// // const URL = process.env.CLIENT_URL_LOCAL;
// // const URL = process.env.CLIENT_URL_DEPLOYMENT

// const io = new Server({
//   cors: {
//     origin: "http://localhost:5173",
//   },
// });

// // const io = new Server({
// //   cors: {
// //     origin: "https://real-estate-nanooka.netlify.app",
// //   },
// // });

// // const io = new Server({
// //   cors: {
// //     origin: URL,
// //   },
// // });

// let onlineUser = [];

// const addUser = (userId, socketId) => {
//   const userExists = onlineUser.find((user) => user.userId === userId);

//   if (!userExists) {
//     onlineUser.push({ userId, socketId });
//   }
// };

// const removeUser = (socketId) => {
//   onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
// };

// const getUser = (userId) => {
//   return onlineUser.find((user) => user.userId === userId);
// };

// io.on("connection", (socket) => {
//   socket.on("newUser", (userId) => {
//     addUser(userId, socket.id);
//   });

//   socket.on("sendMessage", ({ receiverId, data }) => {
//     const receiver = getUser(receiverId);
//     io.to(receiver.socketId).emit("getMessage", data);
//   });

//   socket.on("disconnect", () => {
//     removeUser(socket.id);
//   });
// });

// io.listen("4000", () => {
//   console.log(`Socket.IO server running on port 4000`);
// });

import { Server } from "socket.io";

// Initialize Socket.IO server
// const io = new Server(4000, {
//   cors: {
//     origin: "http://localhost:5173", // Frontend URL
//   },
// });

const io = new Server(4000, {
  cors: {
    origin: "https://real-estate-nanooka.netlify.app", // Frontend URL
  },
});

let onlineUser = [];

// Helper functions
const addUser = (userId, socketId) => {
  const userExists = onlineUser.find((user) => user.userId === userId);
  if (!userExists) {
    onlineUser.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUser.find((user) => user.userId === userId);
};

// WebSocket events
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", data);
      // updateLastMessage(receiverId, data.text);
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

console.log("Socket.IO server running on port 4000");
