import { Request, Response, NextFunction } from "express";
import { AsyncErrorHandler } from "./asyncErrorHandler";
import ErrorHandler from "../utils/errorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";
import { accessTokenOptions, refreshTokenOptions } from "../utils/jwt";
import { updateAccessToken } from "../controllers/user.controller";
require("dotenv").config();

//유저 인증 기능
export const isAuthenticated = AsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token;
    if (!access_token) {
      return next(new ErrorHandler(400, "로그인 먼저 진행해주세요."));
    }

    const decodedToken = jwt.decode(access_token) as jwt.JwtPayload;
    if (!decodedToken) {
      return next(new ErrorHandler(400, "액세스토큰이 유효하지 않습니다."));
    }

    if (decodedToken.exp && decodedToken.exp <= Date.now() / 1000) {
      try {
        await updateAccessToken(req, res, next);
      } catch (error) {
        return next(error);
      }
    } else {
      const user = await redis.get(decodedToken.id);

      if (!user) {
        return next(new ErrorHandler(400, "로그인이 필요합니다."));
      }

      req.user = JSON.parse(user);

      next();
    }
  }
);

//유저 권한 검증
//권한은 여러개 존재함.
// https://stackoverflow.com/questions/70547488/i-am-working-on-authorization-and-it-shows-error-cannot-read-property-role-of
// 권한을 컨트롤 하고싶은데 이런식으로 해결할수있다는 레퍼런스 여러가지 권한 을 사용가능해보임.
export const validateUserRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || "")) {
      return next(
        new ErrorHandler(403, `권한: ${req.user?.role}은 사용할수 없습니다.`)
      );
    }

    return next();
  };
};
