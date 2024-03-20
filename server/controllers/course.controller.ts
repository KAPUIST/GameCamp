import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/errorHandler";
import { AsyncErrorHandler } from "../middleware/asyncErrorHandler";
import cloudinary from "cloudinary";
import { createCourseData } from "../services/course.service";
import CourseModel from "../models/course.model";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/mail";

interface IAddQuestion {
  question: string;
  courseId: string;
  contentId: string;
}
interface IAddAnswerQuestion {
  answer: string;
  courseId: string;
  contentId: string;
  questionId: string;
}
interface IAddReview {
  review: string;
  courseId: string;
  rating: number;
  userId: string;
}
interface IAddReviewReply {
  comment: string;
  courseId: string;
  reviewId: string;
}

//코스등록하기
export const createCourse = AsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      if (thumbnail) {
        const cloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folders: "courses",
        });

        data.thumbnail = {
          public_id: cloud.public_id,
          url: cloud.secure_url,
        };
      }
      createCourseData(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);

//코스 수정하기
export const editCourse = AsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      if (data.thumbnail) {
        await cloudinary.v2.uploader.destroy(data.thumbnail.public_id);

        const cloud = await cloudinary.v2.uploader.upload(data.thumbnail, {
          folder: "Courses",
        });

        data.thumbnail = {
          public_id: cloud.public_id,
          url: cloud.url,
        };
      }

      const courseId = req.params.id;

      const course = await CourseModel.findByIdAndUpdate(
        courseId,
        {
          $set: data,
        },
        { new: true }
      );
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);

//redis를 사용함으로 200ms 에서 35ms 로 시간감소
//한개의 코스 가져오기
export const getSingleCourse = AsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const coursId = req.params.id;

      const isRedisExist = await redis.get(coursId);

      if (isRedisExist) {
        const course = JSON.parse(isRedisExist);
        res.status(200).json({
          success: true,
          course,
        });
      } else {
        const course = await CourseModel.findById(req.params.id).select(
          "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
        );

        await redis.set(coursId, JSON.stringify(course));
        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);

//코스 전부가져오기
export const getAllCourses = AsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isRedisExist = await redis.get("allCourses");
      if (isRedisExist) {
        const course = JSON.parse(isRedisExist);
        res.status(200).json({
          success: true,
          course,
        });
      } else {
        const courses = await CourseModel.find().select(
          "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
        );
        await redis.set("allCourses", JSON.stringify(courses));
        res.status(200).json({
          success: true,
          courses,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);

//코스정보가져오기 -- 권한이 존재하는 유저
export const getCourseByUser = AsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id;

      const courseExist = userCourseList?.find(
        (course: any) => course._id.toString() === courseId
      );

      if (!courseExist) {
        return next(
          new ErrorHandler(404, "강의에 접근할수있는 권한이 존재하지않습니다.")
        );
      }
      const course = await CourseModel.findById(courseId);
      const data = course?.courseData;

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);

//질문 등록하기
export const addQuestion = AsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question, courseId, contentId }: IAddQuestion = req.body;

      const course = await CourseModel.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler(400, "잘못된 코스 정보입니다."));
      }

      const courseContent = course?.courseData.find(
        (el: any) => el._id.toString() === contentId
      );
      if (!courseContent) {
        return next(new ErrorHandler(400, "잘못된 코스 정보입니다."));
      }

      //질문사항 만들기
      const newQuestion: any = {
        user: req.user,
        question,
        questionReplies: [],
      };

      courseContent.questions.push(newQuestion);

      await course?.save();

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);
//질문 대답하기
export const answerQuestion = AsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { answer, courseId, contentId, questionId } =
        req.body as IAddAnswerQuestion;
      const course = await CourseModel.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler(400, "잘못된 코스 정보입니다."));
      }

      const courseContent = course?.courseData.find(
        (el: any) => el._id.toString() === contentId
      );

      if (!courseContent) {
        return next(new ErrorHandler(400, "잘못된 코스 정보입니다."));
      }

      const question = courseContent?.questions?.find(
        (el: any) => el._id.toString() === questionId
      );

      if (!question) {
        return next(new ErrorHandler(400, "잘못된 질문 정보입니다."));
      }
      const newAnswer: any = {
        user: req.user,
        answer,
      };

      question.questionReplies?.push(newAnswer);
      await course?.save();

      if (req.user?._id === question.user._id) {
      } else {
        const data = {
          name: question.user.name,
          title: courseContent.title,
        };
        console.log(data);
        const html = await ejs.renderFile(
          path.join(__dirname, "../mailHtml/question-reply.ejs"),
          data
        );
        try {
          await sendMail({
            email: question.user.email,
            subject: "코멘트 알림",
            html: "question-reply.ejs",
            data,
          });
        } catch (error: any) {
          return next(new ErrorHandler(500, error.message));
        }
      }

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);

//리뷰 등록하기
export const addReview = AsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;

      const courseId = req.params.id;

      const courseExist = userCourseList?.some(
        (course: any) => course._id.toString() === courseId.toString()
      );
      if (!courseExist) {
        return next(new ErrorHandler(500, "코스에 접근할수 없습니다."));
      }

      const course = await CourseModel.findById(courseId);
      const { review, rating } = req.body as IAddReview;
      const reviewData: any = {
        user: req.user,
        comment: review,
        rating,
      };

      course?.reviews.push(reviewData);

      let average = 0;

      course?.reviews.forEach((el: any) => {
        average += el.rating;
      });

      if (course) {
        course.ratings = average / course.reviews.length;
      }

      await course?.save();

      const notification = {
        title: "새로운 리뷰가 작성되었습니다.",
        message: `${course?.name}코스에서 ${req.user?.name}님이 리뷰를 작성하였습니다`,
      };

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);

//리뷰에 답글 달기
export const addReviewReply = AsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { comment, courseId, reviewId } = req.body as IAddReviewReply;

      const course = await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler(404, "코스 정보를 찾을수 없습니다."));
      }

      const review = course.reviews.find(
        (el: any) => el._id.toString() === reviewId
      );

      if (!review) {
        return next(new ErrorHandler(404, "리뷰 정보를 찾을수 없습니다."));
      }
      const replyData: any = {
        user: req.user,
        comment,
      };

      review.commentReplies.push(replyData);

      await course.save();

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);
