import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = async (req, res) => {
  const { username, email, password, phone } = req.body;

  try {
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // add new user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        phone,
      },
    });

    console.log(newUser);

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create user" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // check if user exists
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) return res.status(401).json({ message: "Invalid Credentials" });

    // check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid Credentials" });

    // generate cookie token and send to the user
    // res.setHeader("Set-Cookie", "test=" + "myValue").json("success");

    const age = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign(
      {
        id: user.id,
        isAdmin: false,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    const { password: userPassword, ...userInfo } = user;

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        // secure: false,
        maxAge: age,
        sameSite: "None",
      })
      .status(200)
      .json(userInfo);

    console.log(token);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to log in" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout successfully" });
};

export const googleAuth = async (req, res) => {
  const { credential } = req.body; // credential = Google token

  try {
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, sub: googleId } = ticket.getPayload();

    // Check if user already exists in database
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // If user does not exist, create a new one
      user = await prisma.user.create({
        data: {
          username: name,
          email,
          password: "", // No password needed for Google users
          phone: "", // Optional, can be updated later
          // googleId, // Store Google ID
        },
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, isAdmin: false },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        sameSite: "None",
      })
      .status(200)
      .json({ message: "Google login successful", user });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ message: "Failed to authenticate with Google" });
  }
};
