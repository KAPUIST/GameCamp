import express from "express";
import { isAuthenticated, validateUserRole } from "../middleware/auth";
import {
  createOrder,
  getAllOrdersAdmin,
} from "../controllers/order.controller";

const orderRouter = express.Router();

//주문생성
orderRouter.post("/orders", isAuthenticated, createOrder);

//모든주문 가져오기 -- 어드민
orderRouter.get(
  "/admin/orders",

  isAuthenticated,
  validateUserRole("admin"),
  getAllOrdersAdmin
);
export default orderRouter;
