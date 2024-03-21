import express from "express";
import { isAuthenticated, validateUserRole } from "../middleware/auth";
import {
  editNotification,
  getNotification,
} from "../controllers/notification.controller";
const notificationRoute = express.Router();

notificationRoute.get(
  "/getAllNotification",
  isAuthenticated,
  validateUserRole("admin"),
  getNotification
);
notificationRoute.put(
  "/editNotification/:id",
  isAuthenticated,
  validateUserRole("admin"),
  editNotification
);

export default notificationRoute;
