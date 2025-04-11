import prisma from "../lib/prisma.js";

export const addMessage = async (req, res) => {
  console.log("User ID from token:", req.userId);
  const tokenUserId = req.userId;
  const chatId = req.params.chatId;
  const text = req.body.text;

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
    });

    if (!chat) return res.status(404).json({ message: "chat not found" });

    const message = await prisma.message.create({
      data: {
        text,
        chatId,
        userId: tokenUserId,
      },
    });

    await prisma.chat.update({
      where: {
        id: chatId,
      },
      // data: {
      //   seenBy: [tokenUserId],
      //   lastMessage: [text, tokenUserId],
      // },
      // data: {
      //   seenBy: [tokenUserId],
      // },
      data: {
        seenBy: {
          set: [tokenUserId],
        },
        lastMessage: text, // Store message text
        lastMessageSender: tokenUserId,
      },
    });

    res.status(200).json(message);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "failed to add message" });
  }
};
