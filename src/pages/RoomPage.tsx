import { useState, useEffect } from "react";
import "@egjs/react-flicking/dist/flicking.css";
import Flicking from "@egjs/react-flicking";
import io from "socket.io-client";
import GameList from "../components/RoomPage/GameList";
import MemberList from "../components/RoomPage/MemberList";
import styles from "./RoomPage.module.scss";
import Button from "../components/common/Button";
import { useParams } from "react-router-dom";
const RoomPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  // const { leader } = useSelector((state) => state.room.leader);
  const [socket] = useState(() => io("/room"));
  useEffect(() => {
    let token = localStorage.getItem("token");

    socket.emit("enter", roomId, token);

    // socket.on("metadata", (data) => {
    //   // 폭탄을 옮겨준다.
    //   dispatch(setMetadata(data));
    // });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer}>
        <Button>뒤로가기</Button>
        <label className={styles.masterName}>방장: 장덕수</label>
      </div>
      <Flicking className={styles.roomPageContainer}>
        <div style={{ width: "360px", height: "540px" }}>
          <MemberList roomId={roomId} />
        </div>
        <div style={{ width: "360px", height: "540px" }}>
          <GameList />
        </div>
      </Flicking>
    </div>
  );
};

export default RoomPage;
