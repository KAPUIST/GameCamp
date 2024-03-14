import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorHandler";

export const CustomErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  error.statusCode = error.statusCode || 500;
  error.message = error.message || "server Error";

  //토큰 에러
  if (error.name === "JsonWebTokenError") {
    const message = "JWT is invalid";
    error = new ErrorHandler(400, message);
  }

  //토큰 만료
  if (error.name === "TokenExpiredError") {
    const message = `JWT is Expired`;
    error = new ErrorHandler(400, message);
  }
  //몽고 아이디 에러
  if (error.name === "CastError") {
    const message = `data not found ${error.path}`;
    error = new ErrorHandler(400, message);
  }

  // 중복 키 에러
  if (error.code === 11000) {
    const message = `Duplicate ${Object.keys(error.keyValue)}`;
    error = new ErrorHandler(400, message);
  }

  //에러 리턴
  res.status(error.statusCode).json({
    succes: "false",
    message: error.message,
  });
};
