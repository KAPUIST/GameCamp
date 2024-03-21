import { Response } from "express";
import CourseModel from "../models/course.model";
import { AsyncErrorHandler } from "../middleware/asyncErrorHandler";

export const createCourseData = AsyncErrorHandler(
  async (data: any, res: Response) => {
    const course = await CourseModel.create(data);
    res.status(200).json({
      success: true,
      course,
    });
  }
);

//모든 코스 조회 -- 어드민
export const getAllCourseService = async (res: Response) => {
  const courses = await CourseModel.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    courses,
  });
};
