import { Response } from "express";
import userModel from "../models/user.model";

//유저 조회
export const getUserId = async (id: string, res: Response) => {
  const user = await userModel.findById(id);
  res.status(200).json({
    success: true,
    user,
  });
};
