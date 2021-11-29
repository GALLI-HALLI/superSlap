import styles from "./hunmin2.module.scss";

const hunmin2 = () => {
  return (
    <div className={styles.gameContainer}>
      <div className={styles.playContainer}>
        <div className={styles.suggestAndTime}>
          <div className={styles.gameTime}>총 게임시간</div>
          <div className={styles.suggest}>제시어</div>
        </div>
        <div>
          <div>타 플레이어 기록</div>
        </div>
      </div>
      <div>인풋</div>
      <div>플레이어 목록</div>
    </div>
  );
};

export default hunmin2;
