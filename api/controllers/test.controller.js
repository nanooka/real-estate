import jwt from "jsonwebtoken";

export const shouldBeLoggedIn = async (req, res) => {
  res.status(200).json({ message: "you are authenticated" });
};

export const shouldBeAdmin = async (req, res) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "not authenticated" });

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) return res.status(401).json({ message: "token is not valid" });
    if (!payload.isAdmin)
      return res.status(403).json({ message: "not authorized" });
  });

  res.status(200).json({ message: "you are authenticated" });
};
