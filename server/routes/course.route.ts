import express from "express";
import {
  addQuestion,
  addReview,
  addReviewReply,
  answerQuestion,
  createCourse,
  editCourse,
  getAllCourses,
  getCourseByUser,
  getSingleCourse,
} from "../controllers/course.controller";
import { isAuthenticated, validateUserRole } from "../middleware/auth";
const courseRoute = express.Router();

courseRoute.post(
  "/createCourse",
  isAuthenticated,
  validateUserRole("admin"),
  createCourse
);
courseRoute.put(
  "/editCourse/:id",
  isAuthenticated,
  validateUserRole("admin"),
  editCourse
);
courseRoute.get("/getCourse/:id", getSingleCourse);
courseRoute.get("/getAllCourse", getAllCourses);

courseRoute.get("/getCourseContent/:id", isAuthenticated, getCourseByUser);

courseRoute.put("/addQuestion", isAuthenticated, addQuestion);

courseRoute.put("/addQuestionAnswer", isAuthenticated, answerQuestion);
courseRoute.put("/addReview/:id", isAuthenticated, addReview);
courseRoute.put(
  "/addReviewReply",
  isAuthenticated,
  validateUserRole("admin"),
  addReviewReply
);

export default courseRoute;
