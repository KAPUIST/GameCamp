import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/errorHandler";
import { AsyncErrorHandler } from "../middleware/asyncErrorHandler";
import jwt, { Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/mail";
import { createLoginToken } from "../utils/jwt";
import { redis } from "../utils/redis";
import { getUserId } from "../services/user.service";
require("dotenv").config();

interface IRegister {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}
interface IToken {
  verificationToken: string;
  verificationCode: string;
}
interface IVerificationRequest {
  verification_token: string;
  verification_code: string;
}
interface ILoginRequest {
  email: string;
  password: string;
}

//유저 이메일 인증 컨트롤러
export const registerUser = AsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body as IRegister;

      //이메일 중복 확인
      const isEmailDuplicated = await userModel.findOne({ email });
      if (isEmailDuplicated) {
        return next(new ErrorHandler(400, "이미 존재하는 이메일 입니다."));
      }

      const user: IRegister = {
        name,
        email,
        password,
      };

      //token 오브젝트 반환
      const verificationData = createToken(user);

      //이메일 인증 코드 입니다.
      const verificationCode = verificationData.verificationCode;

      //html 에 들어갈 데이터
      const data = {
        user: { name: user.name },
        verificationCode,
      };

      const verificationEmailHTML = await ejs.renderFile(
        path.join(__dirname, "../mailHtml/verification-mail.ejs"),
        data
      );

      try {
        await sendMail({
          email: user.email,
          subject: "이메일 활성화",
          html: "verification-mail.ejs",
          data,
        });

        res.status(201).json({
          success: true,
          message: `${user.email}메일을 활성화 하기위해 메일함을 확인해 주세요.`,
          verificationToken: verificationData.verificationToken,
        });
      } catch (error: any) {
        return next(new ErrorHandler(400, error.message));
      }
    } catch (error: any) {
      return next(new ErrorHandler(400, error.message));
    }
  }
);

// user: any IRegister IUser 에 맞는 할당하려고 any 사용
export const createToken = (user: any): IToken => {
  //이메일 인증을 위한 랜덤 4가지 넘버
  const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

  // Secret 할당을 해줌
  const token = jwt.sign(
    { user, verificationCode },
    process.env.JWT_CODE as Secret,
    {
      expiresIn: "10m",
    }
  );

  //이메일 인증 4자리 코드와 jwt 토큰 함께발송
  return { verificationToken: token, verificationCode };
};

//유저 이메일 인증과 유저 생성
export const verificationUser = AsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { verification_code, verification_token } =
        req.body as IVerificationRequest;

      const newUser: { user: IUser; verificationCode: string } = jwt.verify(
        verification_token,
        process.env.JWT_CODE as string
      ) as { user: IUser; verificationCode: string };

      //토큰을 해석해서 토큰안에 코드와 유저가 보낸 코드가 일치하지않다면 에러 리턴
      if (newUser.verificationCode !== verification_code) {
        return next(new ErrorHandler(400, "인증코드가 일치 하지않습니다."));
      }

      //유저가 이미 존재하는지 다시 확인
      const { name, email, password } = newUser.user;

      const duplicateUser = await userModel.findOne({ email });

      if (duplicateUser) {
        return next(new ErrorHandler(400, "이미 존재하는 이메일 입니다."));
      }

      // 유저 생성
      const user = await userModel.create({
        name,
        email,
        password,
      });

      res.status(201).json({
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(400, error.message));
    }
  }
);

// 유저 로그인
export const loginUser = AsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;

      //유저 조회
      if (!email || !password) {
        return next(
          new ErrorHandler(400, "비밀번호 또는 이메일을 입력해주세요.")
        );
      }
      //userModel 에서 는 password : {select:false} 를함으로 해당필드를 나오지않지만
      //+password 를 함으로 조회할수있음 보호할필드가 존재할떄 참고.
      const user = await userModel.findOne({ email }).select("+password");

      //해당유저가 존재하지않을시에
      if (!user) {
        return next(
          new ErrorHandler(400, "아이디 또는 비밀번호가 유효하지않습니다.")
        );
      }
      //비밀번호 비교
      //methods로 만든 함수
      const passwordCompare = await user.comparePassword(password);
      if (!passwordCompare) {
        return next(
          new ErrorHandler(400, "아이디 또는 비밀번호가 유효하지않습니다.")
        );
      }

      createLoginToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(400, error.message));
    }
  }
);

//유저로그아웃

export const logoutUser = AsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });

      redis.del(req.user?._id || "");
      res.status(200).json({
        success: true,
        message: "로그아웃 되었습니다.",
      });
    } catch (error: any) {
      return next(new ErrorHandler(400, error.message));
    }
  }
);

//유저 id 조회
export const getUserInfo = AsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;

      await getUserId(userId, res);
    } catch (error: any) {
      return next(new ErrorHandler(400, error.message));
    }
  }
);
