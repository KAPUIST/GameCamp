import { NextFunction, Response } from "express";
import { AsyncErrorHandler } from "../middleware/asyncErrorHandler";
import OrderModel from "../models/order.model";

// 주문 생성
export const createOrderService = AsyncErrorHandler(
  async (data: any, res: Response, next: NextFunction) => {
    const order = await OrderModel.create(data);

    res.status(200).json({
      success: true,
      order,
    });
  }
);

// 모든 주문 조회 -- 어드민
export const getAllOrdersService = async (res: Response) => {
  const orders = await OrderModel.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    orders,
  });
};
