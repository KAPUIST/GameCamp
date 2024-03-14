import { Request, Response, NextFunction } from "express";
import { AsyncErrorHandler } from "./asyncErrorHandler";
import ErrorHandler from "../utils/errorHandler";
import jwt from "jsonwebtoken";
import { redis } from "../utils/redis";
require("dotenv").config();

//유저 인증 기능
export const isAuthenticated = AsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token;

    if (!access_token) {
      return next(new ErrorHandler(400, "로그인 먼저 진행해주세요."));
    }

    const decodedToken = jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN as string
    ) as jwt.JwtPayload;
    if (!decodedToken) {
      return next(new ErrorHandler(400, "액세스토큰이 유효하지 않습니다."));
    }

    const user = await redis.get(decodedToken.id);

    if (!user) {
      return next(new ErrorHandler(400, "유저를 찾을수없습니다."));
    }

    req.user = JSON.parse(user);

    next();
  }
);
