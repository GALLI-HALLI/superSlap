import React, { PropsWithChildren } from "react";
import GoogleButton from "react-google-button";
import { Link, Redirect } from "react-router-dom";
import styles from "./MainPage.module.scss";
import FormInput from "../components/MainPage/FormInput";
import LogoImg from "../components/MainPage/LogoImg";
import Button from "../components/common/Button";
import useProfile from "../hooks/useProfile";
import { AsyncActionStatus } from "../constants/redux";

const googleButtonStyle = {
  width: "310px",
};

const MainPage = ({ children }: PropsWithChildren<{}>) => {
  const { status, data } = useProfile();

  if (status === AsyncActionStatus.Success && data) {
    return <Redirect to="/lobby" push={false} />;
  }

  return (
    <div className={styles.mainPage}>
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
          <Button className={styles.submitBtn}>로그인</Button>
          <Link to="/register">
            <Button>회원가입</Button>
          </Link>
        </div>
        <div className={styles.social}>
          <a href="/api/auth/google">
            <GoogleButton type="light" style={googleButtonStyle}></GoogleButton>
          </a>
        </div>
      </form>
      {children}
    </div>
  );
};

export default MainPage;
