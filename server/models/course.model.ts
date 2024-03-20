import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "./user.model";

interface IComment extends Document {
  user: IUser;
  question: string;
  questionReplies?: IComment[];
}
interface IReview extends Document {
  user: IUser;
  rating: number;
  comment: string;
  commentReplies: IComment[];
}

interface ILinkd extends Document {
  title: string;
  url: string;
}
interface ICourseData extends Document {
  title: string;
  description: string;
  videoUrl: string;
  videoThumbnail: object;
  videoSection: string;
  videoLength: string;
  videoPlayer: string;
  links: ILinkd[];
  suggestion: string;
  questions: IComment[];
}

interface ICourse extends Document {
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  thumbnail: object;
  tags: string;
  level: string;
  demoUrl: string;
  benefits: { title: string }[];
  prequisites: { title: string }[];
  reviews: IReview[];
  courseData: ICourseData[];
  ratings?: number;
  purchased?: number;
}

const reviewSchema = new Schema<IReview>({
  user: Object,
  rating: {
    type: Number,
    default: 0,
  },
  comment: String,
  commentReplies: [Object],
});

const linkSchema = new Schema<ILinkd>({
  title: String,
  url: String,
});

const commentSchema = new Schema<IComment>({
  user: Object,
  question: String,
  questionReplies: [Object],
});
const courseDataSchema = new Schema<ICourseData>({
  videoUrl: String,
  title: String,
  description: String,
  videoSection: String,
  videoLength: Number,
  videoPlayer: String,
  links: [linkSchema],
  suggestion: String,
  questions: [commentSchema],
});

const courseSchema = new Schema<ICourse>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  salePrice: {
    type: Number,
  },
  thumbnail: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  tags: {
    required: true,
    type: String,
  },
  level: {
    type: String,
    required: true,
  },
  demoUrl: {
    type: String,
    required: true,
  },
  benefits: [{ title: String }],
  prequisites: [{ title: String }],
  reviews: [reviewSchema],
  courseData: [courseDataSchema],
  ratings: {
    type: Number,
    default: 0,
  },
  purchased: {
    type: Number,
    default: 0,
  },
});

const CourseModel: Model<ICourse> = mongoose.model<ICourse>(
  "Course",
  courseSchema
);

export default CourseModel;
