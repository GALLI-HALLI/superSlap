import styles from "./BombTutorial.module.scss";
import tutorialImage from "../../image/tutorialBombGame1.png";

const BombTutorial = () => {
  return (
    <>
      <div className={styles.modal}>
        <div className={styles.section}>
          <div className={styles.header}>폭탄 돌리기 튜토리얼!</div>
          <div className={styles.main}>
            <img src={tutorialImage} alt="bombGameTutorial" width="360px" />
          </div>
          {/* 타이머 추가 예정! */}
        </div>
      </div>
    </>
  );
};

export default BombTutorial;
