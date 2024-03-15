import express from "express";
import {
  getUserInfo,
  loginUser,
  logoutUser,
  registerUser,
  verificationUser,
} from "../controllers/user.controller";
import {
  isAuthenticated,
  updateAccessToken,
  validateUserRole,
} from "../middleware/auth";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/verificationuser", verificationUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", isAuthenticated, logoutUser);
userRouter.get("/refreshtoken", updateAccessToken);
userRouter.get("/userinfo", isAuthenticated, getUserInfo);
export default userRouter;
