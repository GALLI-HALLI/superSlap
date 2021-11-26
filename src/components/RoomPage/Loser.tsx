import { useDispatch } from "react-redux";
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
  };

  const backButton = () => {
    dispatch(setMetaData({ data }));
  };

  return (
    <div className={styles.loserContainer}>
      <div className={styles.title}>패배자</div>
      <div className={styles.loserName}>
        <label>아이디: {meta.loser?.id}</label>
        <label>닉네임: {meta.loser?.nickname}</label>
      </div>
      <div className={styles.backBtn}>
        <Button onClick={backButton}>나가기</Button>
      </div>
    </div>
  );
};

export default Loser;
