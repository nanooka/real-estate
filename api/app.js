import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import postRoute from "./routes/post.route.js";
import authRoute from "./routes/auth.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://real-estate-nanooka.netlify.app",
  "https://celebrated-muffin-b7ddbb.netlify.app",
];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (allowedOrigins.includes(origin) || !origin) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );

app.use(cors({ origin: allowedOrigins, credentials: true }));
// app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
// app.use(
//   cors({ origin: "https://real-estate-nanooka.netlify.app", credentials: true })
// );
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/test", testRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

app.listen(8800, () => {
  console.log("Server is running on 8800");
});
// 04:08
