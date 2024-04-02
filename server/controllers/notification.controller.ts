import NotificationModel from "../models/notification.model";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/errorHandler";
import { AsyncErrorHandler } from "../middleware/asyncErrorHandler";
import cron from "node-cron";
// 모든 알림 가져오기 -- 어드민
export const getNotification = AsyncErrorHandler(
  async (req: Response, res: Response, next: NextFunction) => {
    try {
      //-1로 설정함으로 옛날 알림부터 가져오게됨.
      const notifications = await NotificationModel.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        notifications,
      });
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);

// 알림 상태 업데이트 하기 -- 어드민
export const editNotification = AsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notification = await NotificationModel.findById(req.params.id);
      if (!notification) {
        return next(new ErrorHandler(404, "알림이 존재하지 않습니다."));
      } else {
        notification.status
          ? (notification.status = "read")
          : notification.status;
      }

      await notification.save();

      const notifications = await NotificationModel.find().sort({
        createdAt: -1,
      });

      res.status(201).json({
        success: true,
        notifications,
      });
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);

//알림상태 삭제하기
cron.schedule("0 0 0 * * *", async () => {
  const oneDayAgo = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);

  await NotificationModel.deleteMany({
    status: "read",
    createdAt: { $lt: oneDayAgo },
  });
  console.log("Deleted read Notification");
});
