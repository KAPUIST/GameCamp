import React, { FC, useEffect, useRef, useState } from "react";
import { styles } from "@/app/styles/style";
import { toast } from "react-hot-toast";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { useActivationMutation } from "@/redux/features/auth/authApi";
type Props = {
  setRoute: (route: string) => void;
};

//0~3까지의 키값으로 4자리 인증코드를 구성
type VerifyNumber = {
  "0": string;
  "1": string;
  "2": string;
  "3": string;
};
const Verification: FC<Props> = ({ setRoute }) => {
  const { token } = useSelector((state: any) => state.auth);
  const [activation, { error, isSuccess }] = useActivationMutation();
  const [invalidError, setInvalidError] = useState<boolean>(false);

  useEffect(() => {
    if (isSuccess) {
      toast.success("계정이 활성화 되었습니다.");
      setRoute("Login");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
        setInvalidError(true);
      } else {
        console.log(error);
      }
    }
  }, [isSuccess, error]);

  const inputRefs = [
    // input을 받으므로 HTMLInputElement의 제너릭 타입으로 설정해준다.
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  //메일 인증코드 제출시 4자리가 아니면 오류를 리턴하는 함수입니다.
  const verificationHandler = async () => {
    const verificationNumber = Object.values(verifyNumber).join("");

    if (verificationNumber.length !== 4) {
      setInvalidError(true);
      return;
    }

    await activation({
      verification_token: token,
      verification_code: verificationNumber,
    });
  };
  const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
    0: "",
    1: "",
    2: "",
    3: "",
  });
  const handleInputChange = (index: number, value: string) => {
    setInvalidError(false);
    // 두 자리 이상의 숫자를 입력하지 못하도록 처리
    if (value.length > 1) {
      value = value.slice(0, 1);
    }

    // 새로운 인증 번호 객체 생성
    const newVerifyNumber = { ...verifyNumber, [index]: value };

    // 새로운 인증 번호 설정
    setVerifyNumber(newVerifyNumber);

    // 다음 입력란으로 포커스 이동
    if (value === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (value.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };
  return (
    <div>
      <h1 className={`${styles.title}`}>당신의 계정을 인증해 주세요</h1>
      <br />
      <div className="w-full flex items-center justify-center mt-2">
        <div className="w-[80px] h-[80px] rounded-full bg-[#497DF2] flex items-center justify-center">
          <VscWorkspaceTrusted size={40} />
        </div>
      </div>
      <br />
      <br />
      <div className="m-auto flex items-center justify-around">
        {Object.keys(verifyNumber).map((key, index) => (
          <input
            type="number"
            key={key}
            ref={inputRefs[index]}
            className={`w-[65px] h-[65px] bg-transparent border-[3px] rounded-[10px] flex items-center text-black dark:text-white justify-center text-[18px] font-Poppins outline-none text-center ${
              invalidError
                ? " border-red-500"
                : "dark:border-white border-[#0000004a]"
            }`}
            placeholder=""
            maxLength={1}
            value={verifyNumber[key as keyof VerifyNumber]}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
        ))}
      </div>
      <br />
      <br />
      <div className="w-full flex justify-center">
        <button className={`${styles.button}`} onClick={verificationHandler}>
          OTP 인증
        </button>
      </div>
      <br />
      <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
        로그인페이지로 돌아가시겠습니까?{" "}
        <span
          className="text-[#2190ff] pl-1 cursor-pointer"
          onClick={() => setRoute("Login")}
        >
          로그인
        </span>
      </h5>
    </div>
  );
};

export default Verification;
