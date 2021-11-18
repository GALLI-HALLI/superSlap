import Flicking from "@egjs/react-flicking";
import "@egjs/react-flicking/dist/flicking.css";
import GameList from "../components/RoomPage/GameList";
import MemberList from "../components/RoomPage/MemberList";
import styles from "./RoomPage.module.scss";
import Button from "../components/common/Button";

const RoomPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer}>
        <Button>뒤로가기</Button>
        <label className={styles.masterName}>방장: 장덕수</label>
      </div>
      <Flicking className={styles.roomPageContainer}>
        <div style={{ width: "360px", height: "540px" }}>
          <MemberList />
        </div>
        <div style={{ width: "360px", height: "540px" }}>
          <GameList />
        </div>
      </Flicking>
    </div>
  );
};

export default RoomPage;
