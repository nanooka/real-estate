import express from "express";
import postRouter from "./routes/post.route.js";
import authRouter from "./routes/auth.route.js";

const app = express();

app.use("/api/posts", postRouter);
app.use("/api/auth", authRouter);

app.listen(8800, () => {
  console.log("Server is running on 8800");
});
