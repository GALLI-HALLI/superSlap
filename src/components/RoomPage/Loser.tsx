import { useDispatch } from "react-redux";
import { matchPath } from "react-router";
import { GameType, GameStatus } from "../../constants/game";
import { setMetaData } from "../../store/room/room.action";
import { TMetadata } from "../../types/api";
import Button from "../common/Button";
import styles from "./Loser.module.scss";

const Loser = ({ meta }: { meta: TMetadata }) => {
  const dispatch = useDispatch();

  const data: TMetadata = {
    id: meta.id,
    code: meta.code,
    players: meta.players,
    type: GameType.None,
    gameStatus: GameStatus.Idle,
    startTime: "",
    loser: undefined,
    rank: undefined,
  };

  const backButton = () => {
    dispatch(setMetaData({ data }));
  };

  return (
    <div className={styles.loserContainer}>
      <div className={styles.loserTitle}>패배자</div>
      <div className={styles.loserName}>
        <label>아이디: {meta.loser?.id}</label>
        <label>닉네임: {meta.loser?.nickname}</label>
      </div>
      {meta.rank && (
        <>
          <div className={styles.rankTitle}>기록</div>
          <div className={styles.rank}>
            <ul>
              {meta.rank && (
                <li>
                  <span>낙네임</span> <span>점수</span>{" "}
                </li>
              )}
              {meta.rank.map(({ nickname, score }) => {
                return (
                  <li>
                    <span>{nickname}</span> <span>{score}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
      <div className={styles.backBtn}>
        <Button onClick={backButton}>나가기</Button>
      </div>
    </div>
  );
};

export default Loser;
