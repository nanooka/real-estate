import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get users" });
  }
};

export const getUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get user" });
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const { oldPassword, newPassword, avatar, ...inputs } = req.body;

  if (id !== tokenUserId)
    return res.status(403).json({ message: "not authorized" });

  // let updatedPassword = null;

  try {
    // if (password) {
    //   updatedPassword = await bcrypt.hash(password, 10);
    // }

    const user = await prisma.user.findUnique({ where: { id } });

    if (oldPassword) {
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }
    }

    let updatedPassword = null;
    if (newPassword) {
      updatedPassword = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...inputs,
        ...(updatedPassword && { password: updatedPassword }),
        // ...(avatar && { avatar }),
        avatar,
      },
    });

    const { password: userPassword, ...rest } = updatedUser;

    res.status(200).json(rest);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get users" });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  if (id !== tokenUserId)
    return res.status(403).json({ message: "not authorized" });

  try {
    await prisma.user.delete({
      where: { id },
    });
    res.status(200).json({ message: "user deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get users" });
  }
};

export const savePost = async (req, res) => {
  const postId = req.body.postId;
  const tokenUserId = req.userId;

  try {
    const savedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: tokenUserId,
          postId,
        },
      },
    });

    if (savedPost) {
      await prisma.savedPost.delete({
        where: {
          id: savedPost.id,
        },
      });
      res.status(200).json({ message: "post unsaved" });
    } else {
      await prisma.savedPost.create({
        data: {
          userId: tokenUserId,
          postId,
        },
      });
      res.status(200).json({ message: "post saved" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to save post" });
  }
};

// export const profilePosts = async (req, res) => {
//   const userId = req.userId; // ✅ from the verified token

//   try {
//     const userPosts = await prisma.post.findMany({
//       where: { userId },
//     });

//     const saved = await prisma.savedPost.findMany({
//       where: { userId },
//       include: {
//         post: true,
//       },
//     });

//     const savedPosts = saved.map((item) => item.post);

//     res.status(200).json({ userPosts, savedPosts });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to get profile posts" });
//   }
// };

export const profilePosts = async (req, res) => {
  // const tokenUsedId = req.params.userId;
  const tokenUsedId = req.userId;

  try {
    const userPosts = await prisma.post.findMany({
      where: { userId: tokenUsedId },
    });
    const saved = await prisma.savedPost.findMany({
      where: { userId: tokenUsedId },
      include: {
        post: true,
      },
    });
    const savedPosts = saved.map((item) => item.post);

    res.status(200).json({ userPosts, savedPosts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get profile posts" });
  }
};

export const getNotificationNumber = async (req, res) => {
  const tokenUsedId = req.userId;

  try {
    const number = await prisma.chat.count({
      where: {
        userIDs: {
          hasSome: [tokenUsedId],
        },
        NOT: {
          seenBy: {
            hasSome: [tokenUsedId],
          },
        },
      },
    });

    res.status(200).json(number);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get profile posts" });
  }
};
