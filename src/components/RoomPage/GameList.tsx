import styles from "./GameList.module.scss";

const GameList = () => {
  return (
    <div className={styles.GameListContainer}>
      <div className={styles.gameContainer}>
        <div className={styles.gameListTitle}>
          <div>게임 리스트</div>
        </div>
        <div className={styles.gameList}>
          <ul>
            <li>게임 1: 김아무개</li>
            <li>게임 1: 김아무개</li>
            <li>게임 1: 김아무개</li>
            <li>게임 1: 김아무개</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GameList;
