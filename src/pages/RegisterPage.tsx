import { Link } from "react-router-dom";
import FormInput from "../components/MainPage/FormInput";
import LogoImg from "../components/MainPage/LogoImg";
import styles from "./RegisterPage.module.scss";
import Button from "../components/common/Button";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../store/user/user.action";

const existingIds = ["kqjatjr@gmail.com"];

const checkDuplicate = (value: string) =>
  Promise.resolve(!existingIds.includes(value) && value.length > 4);

const RegisterPage = () => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

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
      <LogoImg />
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
            validator={checkDuplicate}
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
            validator={(value: string) => value.length >= 2}
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
            validator={(value: string) => value.length >= 8}
            onChange={({ value }) => {
              setPassword(value);
            }}
          />
        </div>
        <div className={styles.regiBtnContainer}>
          <Link to="/" onClick={() => alert("가입되었습니다!")}>
            <Button type="submit" className={styles.regiBtn}>
              가입 하기
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
