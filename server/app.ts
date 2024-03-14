import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
require("dotenv").config();
import { CustomErrorHandler } from "./middleware/error";
import userRouter from "./routes/user.route";

process.env.NODE_ENV =
  process.env.NODE_ENV &&
  process.env.NODE_ENV.trim().toLowerCase() == "production"
    ? "production"
    : "development";
console.log(`${process.env.NODE_ENV} Mode`);
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
