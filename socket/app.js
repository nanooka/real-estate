import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
dotenv.config();

const URL = process.env.CLIENT_URL_LOCAL;
// const URL = process.env.CLIENT_URL_DEPLOYMENT;

// const corsOptions = {
//   origin: URL,
//   methods: ["GET", "POST"],
//   credentials: true,
// };

// app.use(cors(corsOptions));

app.use(
  cors({
    origin: URL,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Socket server is up 🚀");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let onlineUser = [];

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

io.on("connection", (socket) => {
  console.log("✅ A user connected:", socket.id);

  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", data);
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

server.listen(4000, () => {
  console.log("⚡ Socket.IO server running on port 4000");
});
