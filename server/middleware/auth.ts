import { Request, Response, NextFunction } from "express";
import { AsyncErrorHandler } from "./asyncErrorHandler";
import ErrorHandler from "../utils/errorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
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

//엑세스토큰 업데이트 기능
export const updateAccessToken = AsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //리프레쉬 토큰먼저
      const refresh_token = req.cookies.refresh_token;
      //토큰 해석
      const decodeRefreshToken = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN as string
      ) as JwtPayload;

      if (!decodeRefreshToken) {
        return next(new ErrorHandler(400, "토큰을 재발급할수 없습니다."));
      }

      const user = await redis.get(decodeRefreshToken.id);
      if (!user) {
        return next(new ErrorHandler(400, "토큰을 재발급할수 없습니다."));
      }
      //유저 정보가 세션에 존재한다면
      //토큰을 재발급.
      const userData = JSON.parse(user);

      const accessToken = jwt.sign(
        { id: userData._id },
        process.env.ACCESS_TOKEN as string,
        { expiresIn: "5m" }
      );
      const refreshToken = jwt.sign(
        { id: userData._id },
        process.env.REFRESH_TOKEN as string,
        { expiresIn: "1d" }
      );
    } catch (error: any) {
      return next(new ErrorHandler(400, error.message));
    }
  }
);
