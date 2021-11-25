import { TPlayer } from "../../types/api";
import styles from "./MemberList.module.scss";

const MemberList = ({
  roomId,
  players,
}: {
  roomId: string;
  players: Record<string, TPlayer>;
}) => {
  const playerList = Object.values(players);

  return (
    <div className={styles.MemberListContainer}>
      <div className={styles.memberContainer}>
        <div className={styles.memberCount}>
          <div>플레이어 : {playerList.length}명</div>
          <div className={styles.roomNumber}>방 번호 : {roomId}</div>
        </div>
        <div className={styles.memberList}>
          <ul>
            {playerList.map(({ nickname }) => (
              <li>{nickname}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MemberList;
