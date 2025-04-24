import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

// export const getPosts = async (req, res) => {
//   const query = req.query;

//   try {
//     const posts = await prisma.post.findMany({
//       where: {
//         country: query.country || undefined,
//         city: query.city || undefined,
//         status: query.type || undefined,
//         property: query.property || undefined,
//         bedroom: parseInt(query.bedroom) || undefined,
//         price: {
//           gte: parseInt(query.minPrice) || 0,
//           lte: parseInt(query.maxPrice) || 10000000,
//         },
//         area: {
//           gte: parseInt(query.minArea) || 0,
//           lte: parseInt(query.maxArea) || 10000000,
//         },
//       },
//     });

//     res.status(200).json(posts);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "failed to get posts" });
//   }
// };

export const getPosts = async (req, res) => {
  const query = req.query;

  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: {
          country: query.country || undefined,
          city: query.city || undefined,
          status: query.type || undefined,
          property: query.property || undefined,
          bedroom: query.bedroom ? parseInt(query.bedroom) : undefined,
          price: {
            gte: query.minPrice ? parseInt(query.minPrice) : 0,
            lte: query.maxPrice ? parseInt(query.maxPrice) : 10000000,
          },
          area: {
            gte: query.minArea ? parseInt(query.minArea) : 0,
            lte: query.maxArea ? parseInt(query.maxArea) : 10000000,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),

      prisma.post.count({
        where: {
          country: query.country || undefined,
          city: query.city || undefined,
          status: query.type || undefined,
          property: query.property || undefined,
          bedroom: query.bedroom ? parseInt(query.bedroom) : undefined,
          price: {
            gte: query.minPrice ? parseInt(query.minPrice) : 0,
            lte: query.maxPrice ? parseInt(query.maxPrice) : 10000000,
          },
          area: {
            gte: query.minArea ? parseInt(query.minArea) : 0,
            lte: query.maxArea ? parseInt(query.maxArea) : 10000000,
          },
        },
      }),
    ]);

    res.status(200).json({
      items: posts,
      total,
      hasMore: skip + posts.length < total,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "failed to get posts" });
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        // postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
            phone: true,
            posts: true,
          },
        },
      },
    });

    let userId;

    // const token = req.cookies?.token;
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Get the token from the Authorization header

    if (!token) {
      userId = null;
    } else {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (err) {
          userId = null;
        } else {
          userId = payload.id;
        }
      });
    }

    // const saved = await prisma.savedPost.findUnique({
    //   where: {
    //     userId_postId: {
    //       postId: id,
    //       userId,
    //     },
    //   },
    // });

    const saved = userId
      ? await prisma.savedPost.findUnique({
          where: {
            userId_postId: {
              postId: id,
              userId,
            },
          },
        })
      : null;

    res.status(200).json({ ...post, isSaved: saved ? true : false });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "failed to get post" });
  }
};

export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;

  try {
    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenUserId,
        // postDetail: {
        //   create: body.postDetail,
        // },
      },
    });
    res.status(200).json(newPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "failed to add new post" });
  }
};

export const updatePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const updateData = req.body;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "not authorized" });
    }
    const updatedPost = await prisma.post.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json(updateData);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "failed to update post" });
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "not authorized" });
    }

    await prisma.post.delete({
      where: { id },
    });

    res.status(200).json({ message: "post deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "failed to delete post" });
  }
};
