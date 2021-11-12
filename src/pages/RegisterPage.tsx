import { Link } from "react-router-dom";
import FormInput from "../components/MainPage/FormInput";
import LogoImg from "../components/MainPage/LogoImg";
import styles from "./RegisterPage.module.scss";

const existingIds = ["kqjatjr@gmail.com"];

const checkDuplicate = (value: string) =>
  Promise.resolve(!existingIds.includes(value) && value.length > 4);

const RegisterPage = () => {
  return (
    <div className={styles.RegisterPage}>
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
              console.log(`값은 ${value}, 검증결과는 ${isValid}입니다.`);
            }}
          />
        </div>
        <div className={styles.RegiBtnContainer}>
          <Link to="/" onClick={() => alert("가입되었습니다!")}>
            <button className={styles.RegiBtn}>가입 하기</button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
