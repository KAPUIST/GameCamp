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
userRouter.post("/users/register", registerUser);
//이메일인증
userRouter.post("/users/verification", verificationUser);
//로그인
userRouter.post("/users/login", loginUser);
//로그아웃
userRouter.get("/users/logout", isAuthenticated, logoutUser);

//소셜 로그인
userRouter.post("/users/sociallogin", socialLogin);

//유저 토큰업데이트
userRouter.get("/users/token", updateAccessToken);
//유저 정보 조회
userRouter.get("/users/information", isAuthenticated, getUserInfo);
//유저 정보 수정
userRouter.put("/users/information", isAuthenticated, editUserInfo);
//유저 비밀번호 수정
userRouter.put("/users/password", isAuthenticated, editUserPassword);
//유저 이미지 수정
userRouter.put("/users/avatar", isAuthenticated, editUserAvatar);
//모든유저 가져오기 -- 어드민
userRouter.get(
  "/admin/users",
  isAuthenticated,
  validateUserRole("admin"),
  getAllUsersAdmin
);
export default userRouter;
