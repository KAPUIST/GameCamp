import express from "express";
import {
  getUserInfo,
  loginUser,
  logoutUser,
  registerUser,
  socialLogin,
  verificationUser,
} from "../controllers/user.controller";
import {
  isAuthenticated,
  updateAccessToken,
  validateUserRole,
} from "../middleware/auth";

const userRouter = express.Router();

//회원가입
userRouter.post("/register", registerUser);
//이메일인증
userRouter.post("/verificationuser", verificationUser);
//로그인
userRouter.post("/login", loginUser);
//로그아웃
userRouter.get("/logout", isAuthenticated, logoutUser);

//소셜 로그인
userRouter.post("/sociallogin", socialLogin);

userRouter.get("/refreshtoken", updateAccessToken);
userRouter.get("/userinfo", isAuthenticated, getUserInfo);

export default userRouter;
