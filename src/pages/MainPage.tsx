import React, { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import styles from "./MainPage.module.scss";
import FormInput from "../components/MainPage/FormInput";
import LogoImg from "../components/MainPage/LogoImg";

const MainPage = ({ children }: PropsWithChildren<{}>) => {
  return (
    <div className={styles.MainPage}>
      <LogoImg />
      <form>
        <div className={styles.inputContainer}>
          <FormInput
            name="id"
            label="아이디"
            placeholder="아이디를 입력해 주세요"
          />
          <FormInput
            name="password"
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 입력해 주세요"
          />
        </div>
        <div className={styles.submitBtnContainer}>
          <button type="submit" className={styles.submitBtn}>
            로그인
          </button>
          <Link to="/register">
            <button>회원가입</button>
          </Link>
        </div>
      </form>
      {children}
    </div>
  );
};

export default MainPage;
