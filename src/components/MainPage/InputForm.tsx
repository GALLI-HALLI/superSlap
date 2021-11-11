import FormInput from "./FormInput";
import { Link } from "react-router-dom";
import styles from "./InputForm.module.scss";

const InputForm = () => {
  return (
    <form>
      <div className="InputContainer">
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
      <div className={styles.SubmitBtnContainer}>
        <button type="submit" className={styles.SubmitBtn}>
          로그인
        </button>
        <Link to="/register">
          <button className="RegiBtn">회원가입</button>
        </Link>
      </div>
    </form>
  );
};

export default InputForm;
