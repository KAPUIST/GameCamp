import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/errorHandler";
import { AsyncErrorHandler } from "../middleware/asyncErrorHandler";
import LayoutModel from "../models/layout.model";
import cloudinary from "cloudinary";
//레이아웃 생성하기
export const createLayout = AsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;
      const isTypeExist = await LayoutModel.findOne({ type });
      if (isTypeExist) {
        return next(new ErrorHandler(400, `${type} 이 이미 존재합니다`));
      }
      if (type === "Banner") {
        const { image, title, subTitle } = req.body;
        const cloud = await cloudinary.v2.uploader.upload(image, {
          folder: "layout",
        });
        const banner = {
          image: {
            public_id: cloud.public_id,
            url: cloud.secure_url,
          },
          title,
          subTitle,
        };
        await LayoutModel.create(banner);
      }

      if (type === "FAQ") {
        const { faqData } = req.body;
        const faqItem = faqData.map((item: any) => {
          return {
            question: item.question,
            answer: item.answer,
          };
        });

        await LayoutModel.create({ type: "FAQ", faq: faqItem });
      }
      if (type === "Categories") {
        const { categories } = req.body;
        const categoriesItems = categories.map((item: any) => {
          return {
            title: item.title,
          };
        });

        await LayoutModel.create({
          type: "Categories",
          categories: categoriesItems,
        });
      }

      res.status(200).json({
        success: true,
        message: "레이아웃 만들기 성공.",
      });
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);

//레이아웃 수정기능
export const editLayout = AsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;

      if (type === "Banner") {
        const bannerData: any = await LayoutModel.findOne({ type: "Banner" });
        const { image, title, subTitle } = req.body;
        if (bannerData) {
          await cloudinary.v2.uploader.destroy(bannerData.image.public_id);
        }
        const cloud = await cloudinary.v2.uploader.upload(image, {
          folder: "layout",
        });
        const banner = {
          image: {
            public_id: cloud.public_id,
            url: cloud.secure_url,
          },
          title,
          subTitle,
        };
        await LayoutModel.findByIdAndUpdate(bannerData.id, { banner });
      }

      if (type === "FAQ") {
        const { faqData } = req.body;
        const faqId = await LayoutModel.findOne({ type: "FAQ" });
        const faqItem = faqData.map((item: any) => {
          return {
            question: item.question,
            answer: item.answer,
          };
        });

        await LayoutModel.findByIdAndUpdate(faqId?._id, {
          type: "FAQ",
          faq: faqItem,
        });
      }
      if (type === "Categories") {
        const { categories } = req.body;
        const categoriesId = await LayoutModel.findOne({ type: "Categories" });
        const categoriesItems = categories.map((item: any) => {
          return {
            title: item.title,
          };
        });

        await LayoutModel.findByIdAndUpdate(categoriesId?._id, {
          type: "Categories",
          categories: categoriesItems,
        });
      }

      res.status(200).json({
        success: true,
        message: "레이아웃 업데이트 성공.",
      });
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);

//타입별 레이아웃 가져오기
export const getLayoutByType = AsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;

      const layout = await LayoutModel.findOne({ type });
      res.status(200).json({
        success: true,
        layout,
      });
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);
