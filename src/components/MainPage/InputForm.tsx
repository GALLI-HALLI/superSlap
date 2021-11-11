import React from "react";
import LOGO from "../../image/LOGO.png";
import "../../pages/MainPage.scss";
import FormInput from "./FormInput";

const InputForm = () => {
  return (
    <form>
      <div>
        <img className="LogoImg" alt="MainLogo" src={LOGO} />
      </div>
      <div className="InputContainer">
        <FormInput
          name="id"
          label="아이디"
          placeholder="아이디를 입력해 주세요"
        />
        <FormInput
          name="password"
          label="비밀번호"
          placeholder="비밀번호를 입력해 주세요"
        />
      </div>
      <div className="SubmitBtnContainer">
        <button type="submit" className="SubmitBtn">
          로그인
        </button>
        <button className="RegiBtn">회원가입</button>
      </div>
    </form>
  );
};

export default InputForm;
