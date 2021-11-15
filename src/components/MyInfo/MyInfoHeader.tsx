import React from "react";
import "../../pages/MyInfo.scss";
import MyInfoHeaderDisplay from "./MyInfoHeaderDisplay";
import style from "./MyInfoHeader.module.scss"

const MyInfoHeader = () => {
  return (
    <header className="myInfoHeader">
      <div className={style.top}>
        <button className={style.btn}>뒤로가기</button>
        <h1 className={style.title}> 내 정보 </h1>
        <button className={style.btn}>로그아웃</button>
      </div>
      <MyInfoHeaderDisplay />
    </header>
  );
};

export default MyInfoHeader;