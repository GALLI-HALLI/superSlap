import { TPlayer } from "../../types/api";
import Button from "../common/Button";
import styles from "./MemberList.module.scss";

const MemberList = ({
  roomId,
  players,
}: {
  roomId: string;
  players: Record<string, TPlayer>;
}) => {
  const playerList = Object.values(players);

  const onClickCopy = (str: string) => {
    const tempElement = document.createElement("textarea");
    document.body.appendChild(tempElement);
    tempElement.value = str;
    tempElement.select();
    document.execCommand("copy");
    document.body.removeChild(tempElement);
    alert("복사되었습니다");
  };

  return (
    <div className={styles.MemberListContainer}>
      <div className={styles.memberContainer}>
        <div className={styles.memberCount}>
          <div>플레이어 : {playerList.length}명</div>
          <div className={styles.roomNumber}>방 번호 : {roomId}</div>
          <Button className={styles.copy} onClick={() => onClickCopy(roomId)}>
            복사
          </Button>
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
