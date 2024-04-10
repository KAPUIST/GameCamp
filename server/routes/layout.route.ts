import express from "express";
import { isAuthenticated, validateUserRole } from "../middleware/auth";
import {
  createLayout,
  editLayout,
  getLayoutByType,
} from "../controllers/layout.controller";

const layoutRouter = express.Router();

layoutRouter.get("/layout", getLayoutByType);
layoutRouter.post(
  "/admin/layout",

  isAuthenticated,
  validateUserRole("admin"),
  createLayout
);
layoutRouter.put(
  "/admin/layout",

  isAuthenticated,
  validateUserRole("admin"),
  editLayout
);

export default layoutRouter;
