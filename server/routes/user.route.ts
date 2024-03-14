import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  verificationUser,
} from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/auth";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/verificationuser", verificationUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", isAuthenticated, logoutUser);
export default userRouter;
