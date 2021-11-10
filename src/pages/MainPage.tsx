import React from "react";
import "../styles/MainPage.scss";
import LOGO from "../image/LOGO.png";

const MainPage = () => {
  return (
    <div className="MainPage">
      <form>
        <div>
          <img className="LogoImg" alt="MainLogo" src={LOGO} />
        </div>
        <div className="InputContainer">
          <p>아이디</p>
          <input
            className="LoginIdInputBox"
            placeholder="아이디를 입력해 주세요"
          />
          <p>비밀번호</p>
          <input
            className="LoginPwInputBox"
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
    </div>
  );
};

export default MainPage;
