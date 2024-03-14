require("dotenv").config();
import { Response } from "express";
import { IUser } from "../models/user.model";
import { redis } from "./redis";

//maxAge: 브라우저에서 유지되는 시간.
//secure HTTPS로 통신하는경우 설정함.
//expires 나 max-age 를 둘다 설정시 max-age가 우선 적용. 오래된 브라우저http1.0만
//지원하는 브라우저는 max-age를  지원하지않습니당.

interface IToken {
  httpOnly: boolean;
  sameSite: "lax" | "none" | "strict" | undefined;
  secure: boolean;
  expires: Date;
  maxAge: number;
}

//토큰 생성 로직
export const createLoginToken = (
  user: IUser,
  statusCode: number,
  res: Response
) => {
  const accessToken = user.accessToken();

  const refreshToken = user.refreshToken();
  //string 오류 발생 parsint 로 해결하려 했지만 여전히 string 이 아닌 undefined 발생 해결하기 위해 || '600'
  //더나은 방법 모색
  const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "600"); // 10분 설정
  const refreshTokenExpire = parseInt(
    process.env.REFRESH_TOKEN_EXPIRE || "6000"
  );

  //cookie() 에서는 초가 ms단위
  const accessTokenOptions: IToken = {
    expires: new Date(Date.now() + accessTokenExpire * 1000),
    httpOnly: true,
    sameSite: "lax",
    maxAge: accessTokenExpire * 1000,
    secure: process.env.NODE_ENV === "development" ? false : true,
  };
  const refreshTokenOptions: IToken = {
    expires: new Date(Date.now() + refreshTokenExpire * 1000),
    httpOnly: true,
    sameSite: "lax",
    maxAge: refreshTokenExpire * 1000,
    secure: process.env.NODE_ENV === "development" ? false : true,
  };

  //세션 수정필요
  redis.set(user._id, JSON.stringify(user));

  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};
