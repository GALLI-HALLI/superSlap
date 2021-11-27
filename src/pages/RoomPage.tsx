import { useState, useEffect } from "react";
import "@egjs/react-flicking/dist/flicking.css";
import Flicking from "@egjs/react-flicking";
import io from "socket.io-client";
import MemberList from "../components/RoomPage/MemberList";
import styles from "./RoomPage.module.scss";
import Button from "../components/common/Button";
import { useSelector } from "../hooks/typeReduxHook";
import { useParams, useHistory } from "react-router-dom";
import { setMetaData, setResetRoom } from "../store/room/room.action";
import { useDispatch } from "react-redux";
import { TMetadata } from "../types/api";
import { GameStatus, GameType } from "../constants/game";
import { SocketServerEvent } from "../constants/socket";
import BombGame from "../components/GamePage/BombGame";
import GameList from "../components/RoomPage/GameList";
import Loser from "../components/RoomPage/Loser";
import LeftOrRightGame from "../components/GamePage/LeftOrRightGame";
import Hunmin from "../components/GamePage/Hunmin";

const GameMap = {
  [GameType.None]: () => (
    <div>
      서버에서 문제가 발생했습니다. 게임을 지정하지 않고 게임을 시작할수
      없습니다.
    </div>
  ),
  [GameType.Bomb]: BombGame,
  [GameType.LeftRight]: LeftOrRightGame,
  [GameType.Hunmin]: Hunmin,
};

const RoomPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [socket] = useState(() => io("/api/room"));
  console.log(socket.id);
  const history = useHistory();
  const metadata = useSelector((state) => state.room.metadata);

  const dispatch = useDispatch();

  const backLobby = () => {
    history.push("/lobby");
  };

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      socket.emit("enter", roomId, token);
      socket.on("metadata", (data: TMetadata) => {
        dispatch(setMetaData({ data }));
      });
      socket.on(SocketServerEvent.GameAlreadyStarted, () => {
        alert("이미 진행중이라고~~~");
        socket.disconnect();
        history.push("/lobby");
      });
    }
    return () => {
      dispatch(setResetRoom());
      socket.disconnect();
    };
  }, [socket, dispatch, roomId, history]);

  const joinGame = (type: GameType) => {
    if (type === GameType.None) {
      return;
    }
    socket.emit("gameStart", type);
  };

  if (!metadata) {
    return <div>로딩중 입니다.</div>;
  }

  if (metadata.gameStatus === GameStatus.Ended) {
    if (metadata.loser) {
      return <Loser meta={metadata} />;
    }
  }

  if (metadata.gameStatus === GameStatus.Started) {
    const GameComponent = GameMap[metadata.type];
    return <GameComponent socket={socket} />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer}>
        <Button onClick={backLobby}>뒤로가기</Button>
        <label className={styles.masterName}>방장 아이디: {metadata.id}</label>
      </div>
      <Flicking className={styles.roomPageContainer}>
        <div style={{ width: "360px", height: "540px" }}>
          <MemberList roomId={roomId} players={metadata.players} />
        </div>
        <div style={{ width: "360px", height: "540px" }}>
          <GameList onClickGame={joinGame} />
        </div>
      </Flicking>
    </div>
  );
};

export default RoomPage;
