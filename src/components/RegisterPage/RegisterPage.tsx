import React from "react";
import { Link } from "react-router-dom";
import "../../styles/RegisterPage.scss";

const RegisterPage = () => {
  return (
    <form>
      <div>
        <p>아이디</p>
        <input placeholder="아이디를 입력해 주세요" />
        <div className="IdCheck">
          <button>중복확인</button>
        </div>
        <p>닉네임</p>
        <input placeholder="닉네임을 입력해 주세요" />
        <p>비밀번호</p>
        <input type="password" placeholder="비밀번호를 입력해 주세요" />
        <p>비밀번호 확인</p>
        <input type="password" placeholder="비밀번호를 다시 입력해 주세요" />
      </div>
      <div className="RegiBtnContainer">
        <Link to="/" onClick={() => alert("가입되었습니다!")}>
          <button>가입 하기</button>
        </Link>
      </div>
    </form>
  );
};

export default RegisterPage;
