import React, { memo, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { SocketServerEvent } from "../../constants/socket";
import useProfile from "../../hooks/useProfile";
import Button from "../common/Button";
import styles from "./Hunmin.module.scss";
import GameTutorial from "./GameTutorial";

type THunminPlayer = {
  id: string;
  nickname: string;
  seq: number;
};

type TSocket = {
  socket: Socket;
};

const isPlayerTurn = (id: string, player?: { id: string }) => player?.id === id;

const PLAYER_MAX = 8;

const Hunmin = ({ socket }: TSocket) => {
  const [currentPlayerId, setCurrentPlayerId] = useState<string>("");
  const [players, setPlayers] = useState<THunminPlayer[]>([]);
  const [gameEnd, setGameEnd] = useState(false);
  const { data } = useProfile({ blockAccess: true });
  const [gameTimeRemain, setGameTimeRemain] = useState(0);
  const [turnTimeRemain, setTurnTimeRemain] = useState(0);
  const [start, setStart] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [checkWord, setCheckWord] = useState({
    success: true,
    nickname: "",
    word: "",
    msg: "",
    mean: "",
  });
  const [gameMeta, setGameMeta] = useState<{
    suggest?: string;
    gameTimeLimit: number;
    turnTimeLimit: number;
  }>({
    suggest: undefined,
    gameTimeLimit: 0,
    turnTimeLimit: 0,
  });

  const currentUser = {
    backgroundColor: "rgba(0,255,0, 0.8)",
    border: "1px solid rgba(0, 0, 0, 0.05)",
    boxShadow: "0 0 10px #00CC00",
  };

  const nomalUser = {
    backgroundColor: "rgba(128,128,128, 0.8)",
  };

  const answer = {
    backgroundColor: "rgba(0,0,0, 0.8)",
    border: "1px solid rgba(0, 0, 0, 0.05)",
    boxShadow: "0 0 10px #FFFFFF",
  };

  const wrong = {
    backgroundColor: "rgba(255,0,0, 0.8)",
    border: "1px solid rgba(255, 0, 0, 0.05)",
    boxShadow: "0 0 10px #FF0000",
  };

  const changeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const postWord = () => {
    socket.emit("word", { word: inputValue, turn: currentPlayerId });
  };

  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      postWord();
    }
  };

  // 소켓 초기화
  useEffect(() => {
    // 현재 턴의 플레이어 아이디
    socket.on("nextTurn", (id) => {
      setCurrentPlayerId(id);
    });

    // 랜덤으로 섞인 유저들의 집합
    socket.on("join_user", (data) => {
      setPlayers((prev) => {
        const nextPlayers = [...prev, data];
        nextPlayers.sort((a, b) => a.seq - b.seq);
        return nextPlayers;
      });
    });

    socket.on("hunminData", (data) => {
      setCheckWord(data);
      if (data.success) {
        setTurnTimeRemain(10000);
      }
      setInputValue("");
    });

    socket.on("setInitial", (data) => {
      setGameMeta(data);
      setGameTimeRemain(data.gameTimeLimit);
      setTurnTimeRemain(data.turnTimeLimit);
      setStart(true);
    });

    socket.on(SocketServerEvent.GameEnd, () => {
      setGameEnd(true);
    });

    return () => {
      socket.off("setInitial");
      socket.off("word");
      socket.off("nextTurn");
      socket.off("join_user");
      socket.off("hunminData");
    };
  }, [socket]);

  useEffect(() => {
    setInterval(() => {
      setTurnTimeRemain((prev) => prev - 10);
    }, 10);
  }, [setTurnTimeRemain]);

  useEffect(() => {
    if (gameMeta.suggest) {
      setInterval(() => {
        setGameTimeRemain((prev) => prev - 1000);
      }, 1000);
    }
  }, [gameMeta]);

  const renderItems = [...players, ...new Array(PLAYER_MAX - players.length)]; // undefined

  return (
    <div className={styles.gameContainer}>
      {!start && <GameTutorial game={"hunmin"} />}
      {gameEnd && (
        <div className={styles.modal}>
          <div className={styles.section}>
            <div className={styles.main}>GAME END</div>
          </div>
        </div>
      )}
      <div
        className={styles.playContainer}
        style={checkWord.success ? answer : wrong}
      >
        <div className={styles.suggestAndTime}>
          <div className={styles.gameTime}>{gameTimeRemain / 1000}</div>
          <div className={styles.suggest}>{gameMeta.suggest}</div>
        </div>
        <div className={styles.gameRecord}>
          <label className={styles.nickname}>{checkWord.nickname}</label>
          <label className={styles.userWord}>{checkWord.word}</label>
          <label className={styles.passMsg}>{checkWord.msg}</label>
          <label className={styles.mean}>{checkWord.mean}</label>
        </div>
      </div>
      <div
        style={{
          width: `${turnTimeRemain / 100}%`,
        }}
        className={styles.progressBar}
      ></div>
      <div className={styles.players}>
        <div className={styles.playerA}>
          {renderItems.map((player) => {
            if (!player) {
              return <div>없음</div>;
            }
            const { id, nickname } = player;

            return (
              <div
                className={styles.currentPlayer}
                style={
                  isPlayerTurn(currentPlayerId, player)
                    ? currentUser
                    : nomalUser
                }
              >
                {nickname}
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.inputContainer}>
        <input
          value={inputValue}
          onChange={changeValue}
          onKeyPress={onKeyPress}
          disabled={!isPlayerTurn(currentPlayerId, data)}
        />
        <Button
          onClick={postWord}
          disabled={!isPlayerTurn(currentPlayerId, data)}
        >
          제출
        </Button>
      </div>
    </div>
  );
};
export default memo(Hunmin);
