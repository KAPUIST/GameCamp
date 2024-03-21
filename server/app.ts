import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
require("dotenv").config();
import { CustomErrorHandler } from "./middleware/error";
import userRouter from "./routes/user.route";
import courseRoute from "./routes/course.route";
import morgan from "morgan";
import orderRouter from "./routes/order.route";
import notificationRoute from "./routes/notification.route";

process.env.NODE_ENV =
  process.env.NODE_ENV &&
  process.env.NODE_ENV.trim().toLowerCase() == "production"
    ? "production"
    : "development";

console.log(`${process.env.NODE_ENV} Mode`);

if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined")); // 배포환경이면
} else {
  app.use(morgan("dev")); // 개발환경이면
}
//바디파서
app.use(express.json({ limit: "50mb" }));

//쿠키파서
app.use(cookieParser());

//cors
app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);

//라우터
app.use("/api/v1", userRouter);
app.use("/api/v1", courseRoute);
app.use("/api/v1", orderRouter);
app.use("/api/v1", notificationRoute);

//Error Hanler
app.use(CustomErrorHandler);

app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "is Working",
  });
});

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});
