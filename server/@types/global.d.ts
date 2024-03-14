import { Request } from "express";
import { IUser } from "../models/user.model";
// 레퍼런스 https://velog.io/@sinf/error-TS2339-Property-user-does-not-exist-on-type-Reqeust
//Request 에 user 를 넣기위한 커스텀 타입.
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
