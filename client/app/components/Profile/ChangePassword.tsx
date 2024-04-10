import React, { FC, useEffect, useState } from "react";
import { styles } from "../../styles/style";
import { useUpdatePasswordMutation } from "../../../redux/features/user/userApi";
import { toast } from "react-hot-toast";
type Props = {};

const ChangePassword: FC<Props> = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [updatePassword, { isSuccess, error }] = useUpdatePasswordMutation();
  const passwordHandler = async (e: any) => {
    e.preventDefault();
    // if (oldPassword === "" || newPassword === "" || confirmPassword === "") {
    //   toast.error("모두 작성해 주세요.");
    // }
    if (newPassword !== confirmPassword) {
      toast.error("비밀번호가 일치하지 않습니다.");
    } else {
      await updatePassword({ oldPassword, newPassword });
    }
  };
  useEffect(() => {
    if (isSuccess) {
      toast.success("비밀번호가 변경 되었습니다.");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, [isSuccess, error]);
  return (
    <div className="w-full pl-7 px-2 800px:px-5 800px:pl-0">
      <h1 className="block text-[25px] 800px:text-[30px] font-Poppins text-center font-[500] text-black dark:text-[#fff] pb-2">
        비밀번호 변경
      </h1>
      <div className="w-full">
        <form onSubmit={passwordHandler} className="flex flex-col items-center">
          <div className=" w-[100%] 800px:w-[60%] mt-5">
            <label className="block pb-2 text-black dark:text-[#fff]">
              기존 비밀번호
            </label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0 text-black dark:text-[#fff]`}
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className=" w-[100%] 800px:w-[60%] mt-2">
            <label className="block pb-2 text-black dark:text-[#fff]">
              새로운 비밀번호
            </label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0 text-black dark:text-[#fff]`}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className=" w-[100%] 800px:w-[60%] mt-2">
            <label className="block pb-2 text-black dark:text-[#fff]">
              비밀번호 확인
            </label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0 text-black dark:text-[#fff]`}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <input
              className={`w-[95%] h-[40px] border border-[#37a39a] text-center text-black dark:text-[#fff] rounded-[3px] mt-8 cursor-pointer`}
              required
              value="Update"
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
