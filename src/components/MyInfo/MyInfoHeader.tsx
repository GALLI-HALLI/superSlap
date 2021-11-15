import React from "react";
import "../../pages/MyInfo.scss";
import MyInfoHeaderDisplay from "./MyInfoHeaderDisplay";
import styles from "./MyInfoHeader.module.scss";

const MyInfoHeader = () => {
  return (
    <header className="myInfoHeader">
      <div className={styles.top}>
        <button className={styles.btn}>뒤로가기</button>
        <h1 className={styles.title}> 내 정보 </h1>
        <button className={styles.btn}>로그아웃</button>
      </div>
      <MyInfoHeaderDisplay />
    </header>
  );
};

export default MyInfoHeader;
