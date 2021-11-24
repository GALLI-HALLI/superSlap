import { TPlayer } from "../../types/api";
import styles from "./MemberList.module.scss";

const MemberList = ({
  roomId,
  players,
}: {
  roomId: string;
  players: Record<string, TPlayer>;
}) => {
  return (
    <div className={styles.MemberListContainer}>
      <div className={styles.memberContainer}>
        <div className={styles.memberCount}>
          <div>플레이어 : {players.length}명</div>
          <div className={styles.roomNumber}>방 번호 : {roomId}</div>
        </div>
        <div className={styles.memberList}>
          <ul>
            {Object.values(players).map(({ nickname }) => (
              <li>{nickname}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MemberList;
