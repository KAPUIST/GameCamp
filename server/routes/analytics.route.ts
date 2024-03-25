import exress from "express";
import { isAuthenticated, validateUserRole } from "../middleware/auth";
import {
  getCourseAnalytics,
  getOrderAnalytics,
  getUserAnalytics,
} from "../controllers/analytics.controller";

const analyticsRouter = exress.Router();

//유저 분석 -- 어드민
analyticsRouter.get(
  "/admin/analytics/users",
  isAuthenticated,
  validateUserRole("admin"),
  getUserAnalytics
);
//코스 분석 -- 어드민
analyticsRouter.get(
  "/admin/analytics/course",
  isAuthenticated,
  validateUserRole("admin"),
  getCourseAnalytics
);
//오더 분석 -- 어드민
analyticsRouter.get(
  "/admin/analytics/order",
  isAuthenticated,
  validateUserRole("admin"),
  getOrderAnalytics
);

export default analyticsRouter;
