import { Link } from "react-router-dom";
import FormInput from "../components/MainPage/FormInput";
import LogoImg from "../components/MainPage/LogoImg";
import styles from "./RegisterPage.module.scss";
import Button from "../components/common/Button";
import { useState } from "react";

const existingIds = ["kqjatjr@gmail.com"];

const checkDuplicate = (value: string) =>
  Promise.resolve(!existingIds.includes(value) && value.length > 4);

const RegisterPage = () => {
  const [id, setId] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className={styles.registerPage}>
      <LogoImg />
      <form>
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
            onChange={({ value, isValid }) => {
              setId(value);
              console.log(`값은 ${value}, 검증결과는 ${isValid}입니다.`);
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
            onChange={({ value, isValid }) => {
              setNickname(value);
              console.log(`값은 ${value}, 검증결과는 ${isValid}입니다.`);
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
            onChange={({ value, isValid }) => {
              setPassword(value);
              console.log(`값은 ${value}, 검증결과는 ${isValid}입니다.`);
            }}
          />
        </div>
        <div className={styles.regiBtnContainer}>
          <Link to="/" onClick={() => alert("가입되었습니다!")}>
            <Button className={styles.regiBtn}>가입 하기</Button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
