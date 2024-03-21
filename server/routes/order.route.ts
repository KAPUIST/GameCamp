import express from "express";
import { isAuthenticated, validateUserRole } from "../middleware/auth";
import {
  createOrder,
  getAllOrdersAdmin,
} from "../controllers/order.controller";

const orderRouter = express.Router();

orderRouter.post("/createOrder", isAuthenticated, createOrder);

orderRouter.get(
  "/getAllOrdersAdmin",
  isAuthenticated,
  validateUserRole("admin"),
  getAllOrdersAdmin
);
export default orderRouter;
