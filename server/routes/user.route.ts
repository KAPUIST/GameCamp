import express from "express";
import {
  editUserAvatar,
  editUserInfo,
  editUserPassword,
  getAllUsersAdmin,
  getUserInfo,
  loginUser,
  logoutUser,
  registerUser,
  socialLogin,
  updateAccessToken,
  verificationUser,
} from "../controllers/user.controller";
import { isAuthenticated, validateUserRole } from "../middleware/auth";

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

//유저 토큰업데이트
userRouter.get("/refreshtoken", updateAccessToken);
//유저 정보 조회
userRouter.get("/userinfo", isAuthenticated, getUserInfo);
//유저 정보 수정
userRouter.put("/edituserinfo", isAuthenticated, editUserInfo);
//유저 비밀번호 수정
userRouter.put("/edituserpassword", isAuthenticated, editUserPassword);
//유저 이미지 수정
userRouter.put("/edituseravatar", isAuthenticated, editUserAvatar);
//모든유저 가져오기 -- 어드민
userRouter.get(
  "/getAllUsersAdmin",
  isAuthenticated,
  validateUserRole("admin"),
  getAllUsersAdmin
);
export default userRouter;
