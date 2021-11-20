import Flicking from "@egjs/react-flicking";
import io from "socket.io-client";
import GameList from "../components/RoomPage/GameList";
import MemberList from "../components/RoomPage/MemberList";
import styles from "./RoomPage.module.scss";
import Button from "../components/common/Button";

const RoomPage = ({ match }: { match: string[] }) => {
  const socket = io(`/room`);
  let code = document.location.href.split("room/");
  let token = localStorage.getItem("token");
  socket.emit("enter", code[1], token);
  socket.on("noRoom", () => {
    console.log("방이 없습니다");
  });

  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer}>
        <Button>뒤로가기</Button>
        <label className={styles.masterName}>방장: 장덕수</label>
      </div>
      <Flicking className={styles.roomPageContainer}>
        <div style={{ width: "360px", height: "540px" }}>
          <MemberList roomCode={match} />
        </div>
        <div style={{ width: "360px", height: "540px" }}>
          <GameList />
        </div>
      </Flicking>
    </div>
  );
};

export default RoomPage;
