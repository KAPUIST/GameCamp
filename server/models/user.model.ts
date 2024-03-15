import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
require("dotenv").config();

// check 필요!
const emailValidationReg: RegExp =
  /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: {
    id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  courses: Array<{ courseId: string }>;
  comparePassword: (password: string) => Promise<boolean>;
  accessToken: () => string;
  refreshToken: () => string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "이름을 입력해 주세요."],
    },
    email: {
      type: String,
      required: [true, "이메일을 입력해 주세요."],
      validate: {
        validator: function (value: string) {
          return emailValidationReg.test(value);
        },
        message: "올바른 형식의 이메일을 입력해주세요.",
      },
      unique: true,
    },
    password: {
      type: String,
      minlength: [8, "최소 8자리 이상의 비밀번호를 입력해주세요."],
      //select false 를 하여 쿼리 결과로 비밀번호를 포함하지 않습니다.
      select: false,
    }, //프로필 사진
    avatar: {
      id: String,
      url: String,
    },
    //권한관리
    role: {
      type: String,
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    //배열 형식의 강의 내용
    courses: [
      {
        coursId: String,
      },
    ],
  },
  { timestamps: true }
);
//패스워드 암호화
// pre = 몽구스의 middleware기능이다   - init, validate, save, remove
// 메소드 수행시 처리되는 미들웨어 펑션이다   - 복잡한 유효성검사,
// 트리거 이벤트 처리등. 예로 사용자를 삭제하면 사용자 관련 블로그포스트도
// 삭제하기같은 경우 사용  또는 에러 핸들링
userSchema.pre<IUser>("save", async function (next) {
  //유저가 패스워드를 변경할때만  해싱
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//비밀번호 체크
userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

//엑세스토큰 발급
userSchema.methods.accessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || "", {
    expiresIn: "5m",
  });
};
//리프레쉬 토큰 발급
userSchema.methods.refreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || "", {
    expiresIn: "1d",
  });
};

const userModel: Model<IUser> = mongoose.model("User", userSchema);

export default userModel;
