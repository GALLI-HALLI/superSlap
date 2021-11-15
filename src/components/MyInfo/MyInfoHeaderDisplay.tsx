import React from "react";
import "../../pages/MyInfo.scss";
import styles from "./MyInfoHeaderDisplay.module.scss";
import Button from "../common/Button";

const MyInfoHeaderDisplay = () => {
  const userInfo = {
    nickName: "답수",
    achievementTitle: "위대한 패배자",
  };

  return (
    <div className={styles.display}>
      <div className={styles.wrap}>
        <img
          src="https://yt3.ggpht.com/ytc/AKedOLSAjLrkn8vs3X-ktbZcLCFw1iSwBVgY1otbTAse=s900-c-k-c0x00ffffff-no-rj"
          alt="Example Character"
          className={styles.character}
        ></img>
        <div className={styles.nameAndTitle}>
          <h2>{userInfo.nickName}</h2>
          <p>{userInfo.achievementTitle}</p>
        </div>
      </div>
      <Button className={styles.btn}>정보 수정</Button>
    </div>
  );
};

export default MyInfoHeaderDisplay;
