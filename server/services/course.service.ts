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
