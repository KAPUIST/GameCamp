import express from "express";
import {
  addQuestion,
  addReview,
  addReviewReply,
  answerQuestion,
  createCourse,
  delCourse,
  editCourse,
  generateVideoUrl,
  getAllCourses,
  getAllCoursesAdmin,
  getCourseByUser,
  getSingleCourse,
} from "../controllers/course.controller";
import { isAuthenticated, validateUserRole } from "../middleware/auth";

const courseRoute = express.Router();

//코스생성
courseRoute.post(
  "/courses",

  isAuthenticated,
  validateUserRole("admin"),
  createCourse
);
//코스 수정
courseRoute.put(
  "/courses/:id/edit",
  isAuthenticated,
  validateUserRole("admin"),
  editCourse
);
//단일코스 가져오기
courseRoute.get("/course/:id", getSingleCourse);

//모든코스 가져오기
courseRoute.get("/courses", getAllCourses);

// 사용자별 코스 내용 가져오기
courseRoute.get(
  "/course/user/:id",

  isAuthenticated,
  getCourseByUser
);

//질문 추가 하기
courseRoute.put(
  "/course/question",

  isAuthenticated,
  addQuestion
);

//질문에 대한 답변 추가하기
courseRoute.put(
  "/course/answer",

  isAuthenticated,
  answerQuestion
);

//리뷰 추가하기
courseRoute.put(
  "/course/review/:id",

  isAuthenticated,
  addReview
);

//리뷰에 답글추가
courseRoute.put(
  "/course/reply/review",
  isAuthenticated,
  validateUserRole("admin"),
  addReviewReply
);

courseRoute.post("/getVdocipherOTP", generateVideoUrl);

//모든 코스 가져오기 --어드민 전용
courseRoute.get(
  "/admin/courses",
  isAuthenticated,
  validateUserRole("admin"),
  getAllCoursesAdmin
);

//코스 삭제하기 -- 어드민
courseRoute.delete(
  "/admin/course/:id",
  isAuthenticated,
  validateUserRole("admin"),
  delCourse
);
export default courseRoute;
