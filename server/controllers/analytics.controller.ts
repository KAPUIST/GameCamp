import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/errorHandler";
import { AsyncErrorHandler } from "../middleware/asyncErrorHandler";
import { last12MonthsData } from "../utils/analytics";
import userModel from "../models/user.model";
import OrderModel from "../models/order.model";
import CourseModel from "../models/course.model";

// 유저 분석 기능 -- 어드민

export const getUserAnalytics = AsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const course = await last12MonthsData(userModel);

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);
//12개월간 코스 분석 -- 어드민
export const getCourseAnalytics = AsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const course = await last12MonthsData(CourseModel);

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);
//12개월간 코스 분석 -- 어드민
export const getOrderAnalytics = AsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await last12MonthsData(OrderModel);

      res.status(200).json({
        success: true,
        order,
      });
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);
