import express from "express";
import { isAuthenticated, validateUserRole } from "../middleware/auth";
import {
  editNotification,
  getNotification,
} from "../controllers/notification.controller";
const notificationRoute = express.Router();

//모든알림 가져오기
notificationRoute.get(
  "/admin/notifications",
  isAuthenticated,
  validateUserRole("admin"),
  getNotification
);
//알림 수정하기
notificationRoute.put(
  "/admin/notifications/:id",
  isAuthenticated,
  validateUserRole("admin"),
  editNotification
);

export default notificationRoute;
