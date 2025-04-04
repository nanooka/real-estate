import express from "express";
import {
  login,
  logout,
  register,
  googleAuth,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/google", googleAuth);

export default router;
