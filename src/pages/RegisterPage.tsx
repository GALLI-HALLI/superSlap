import { useEffect } from "react";
import FormInput from "../components/MainPage/FormInput";
import styles from "./RegisterPage.module.scss";
import Button from "../components/common/Button";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser, setResetRegister } from "../store/user/user.action";
import { useSelector } from "../hooks/typeReduxHook";
import { AsyncActionStatus } from "../constants/redux";
import { useHistory } from "react-router";
import { checkIdVaild } from "../service/auth";

const usernameValidator = (value: string) =>
  checkIdVaild(value).then(({ success }) => success && value.length > 5);

const RegisterPage = () => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const registerStatus = useSelector((store) => store.user.register.status);
  const history = useHistory();

  useEffect(() => {
    if (registerStatus === AsyncActionStatus.Success) {
      alert("회원가입 성공");
      dispatch(setResetRegister());
      history.push("/");
    }
  }, [registerStatus, history]);

  useEffect(() => {});

  const dispatch = useDispatch();

  const onSubmit = (form: { id: string; password: string; name: string }) => {
    dispatch(registerUser(form));
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = { id, name, password };
    onSubmit(data);
  };

  return (
    <div className={styles.registerPage}>
      <label className={styles.name}>SUPER SLAP</label>
      <form method="POST" onSubmit={handleFormSubmit}>
        <div>
          <FormInput
            name="id"
            label="아이디"
            message={{
              valid: "사용 가능한 아이디 입니다.",
              invalid: "사용 불가능한 아이디 입니다.",
            }}
            placeholder="아이디를 입력해 주세요"
            validator={usernameValidator}
            onChange={({ value }) => {
              setId(value);
            }}
          />
          <FormInput
            name="nickname"
            label="닉네임"
            placeholder="닉네임을 입력해 주세요"
            message={{
              valid: "사용가능한 닉네임 입니다.",
              invalid: "사용 불가능한 닉네임 입니다.",
            }}
            validator={(value: string) => value.length >= 1}
            onChange={({ value }) => {
              setName(value);
            }}
          />
          <FormInput
            name="password"
            label="비밀번호"
            type="password"
            placeholder="비밀 번호를 입력해 주세요"
            message={{
              valid: "사용가능한 비밀번호 입니다.",
              invalid: "사용 불가능한 비밀번호 입니다.",
            }}
            validator={(value: string) => value.length >= 6}
            onChange={({ value }) => {
              setPassword(value);
            }}
          />
        </div>
        <div className={styles.regiBtnContainer}>
          <Link to="/">
            <Button className={styles.regiBtn}>뒤로가기</Button>
          </Link>
          <Button type="submit" className={styles.regiBtn}>
            가입 하기
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
