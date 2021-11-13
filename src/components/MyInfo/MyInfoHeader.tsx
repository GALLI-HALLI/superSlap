import React from "react";
import "../../pages/MyInfo.scss";
import MyInfoHeaderDisplay from "./MyInfoHeaderDisplay";
import TopStyle from "./MyInfoHeader.module.scss"

const MyInfoHeader = () => {
  return (
    <header className="MyInfoHeader">
      <div className={TopStyle.Top}>
        <button className={TopStyle.Btn}>뒤로가기</button>
        <h1 className={TopStyle.Title}> 내 정보 </h1>
        <button className={TopStyle.Btn}>로그아웃</button>
      </div>
      <MyInfoHeaderDisplay />
    </header>
  );
};

export default MyInfoHeader;