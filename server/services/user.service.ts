import { Response } from "express";
import userModel from "../models/user.model";
import { redis } from "../utils/redis";

//유저 조회
//redis를 사용하고있으므로 redis에서 가져오도록 요청.
export const getUserId = async (id: string, res: Response) => {
  const userInRedis = await redis.get(id);

  if (userInRedis) {
    const user = JSON.parse(userInRedis);
    res.status(200).json({
      success: true,
      user,
    });
  }
  //await userModel.findById(id);
};

//모든 유저 조회 -- 어드민
export const getAllUsersService = async (res: Response) => {
  const users = await userModel.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    users,
  });
};

//유저 권한 변경
export const editUserRoleService = async (
  res: Response,
  id: string,
  role: string
) => {
  const user = await userModel.findByIdAndUpdate(id, { role }, { new: true });

  res.status(201).json({
    success: true,
    user,
  });
};
