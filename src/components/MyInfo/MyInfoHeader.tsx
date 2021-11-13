import React from "react";
import "../../pages/MyInfo.scss";
import MyInfoHeaderDisplay from "./MyInfoHeaderDisplay";
import styles from "./MyInfoHeader.module.scss";
import Button from "../common/Button";

const MyInfoHeader = () => {
  return (
    <header className="myInfoHeader">
      <div className={styles.top}>
        <Button className={styles.btn}>뒤로가기</Button>
        <h1 className={styles.title}> 내 정보 </h1>
        <Button className={styles.btn}>로그아웃</Button>
      </div>
      <MyInfoHeaderDisplay />
    </header>
  );
};

export default MyInfoHeader;
