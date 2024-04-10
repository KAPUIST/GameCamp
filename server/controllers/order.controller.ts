import { NextFunction, Request, Response } from "express";

import { AsyncErrorHandler } from "../middleware/asyncErrorHandler";
import ErrorHandler from "../utils/errorHandler";
import OrderModel, { IOrder } from "../models/order.model";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/mail";
import NotificationModel from "../models/notification.model";
import {
  createOrderService,
  getAllOrdersService,
} from "../services/order.service";

// 주문 생성
export const createOrder = AsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, paymentInfo } = req.body as IOrder;

      const user = await userModel.findById(req.user?._id);

      const courseExistUser = user?.courses.some(
        (el: any) => el._id.toString() === courseId
      );

      if (courseExistUser) {
        return next(new ErrorHandler(400, "이미 결제된 코스 입니다."));
      }

      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler(400, "코스를 찾을수 없습니다."));
      }

      const data: any = {
        courseId: course._id,
        userId: user?._id,
        paymentInfo,
      };

      const mailData = {
        order: {
          _id: course._id,
          name: course.name,
          price: course.price,
          date: new Date().toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mailHtml/order-confirmation.ejs"),
        mailData
      );
      try {
        if (user) {
          await sendMail({
            email: user.email,
            subject: "주문 확인서",
            html: "order-confirmation.ejs",
            data: mailData,
          });
        }
      } catch (error: any) {
        return next(new ErrorHandler(500, error.message));
      }
      user?.courses.push(course._id);

      await user?.save();

      const notification = await NotificationModel.create({
        user: user?._id,
        title: "새로운 주문이 접수되었습니다.",
        message: `${course.name} 해당코스에 주문이 접수되었습니다.`,
      });

      course.purchased = course.purchased + 1;

      await course.save();

      createOrderService(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);

//모든 주문 조회 -- 어드민
export const getAllOrdersAdmin = AsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getAllOrdersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);
