import React, { memo, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import Button from "../common/Button";
import styles from "./Hunmin.module.scss";

type THunminPlayer = {
  id: string;
  seq: number;
};

type TSocket = {
  socket: Socket;
};

const Hunmin = ({ socket }: TSocket) => {
  const [currentPlayerId, setCurrentPlayerId] = useState<string>("");
  const [players, setPlayers] = useState<THunminPlayer[]>([]);
  const [gameTimeRemain, setGameTimeRemain] = useState(0);
  const [turnTimeRemain, setTurnTimeRemain] = useState(5);
  const [inputValue, setInputValue] = useState("");
  const [gameMeta, setGameMeta] = useState({
    suggest: "",
    gameTimeLimit: 0,
    trunTimeLimit: 0,
  });
  const [checkMsg, setCheckMsg] = useState("");
  const [words, setWords] = useState<string[]>([]);

  const changeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const postWord = () => {
    socket.emit("word", inputValue);
  };

  // // 소켓 초기화
  // useEffect(() => {
  //   // 현재 턴의 플레이어 아이디
  //   socket.on("nextTurn", (id) => {
  //     setCurrentPlayerId(id);
  //   });

  //   // 랜덤으로 섞인 유저들의 집합
  //   socket.on("join_user", (data) => {
  //     setPlayers((prev) => {
  //       const nextPlayers = [...prev, data];
  //       nextPlayers.sort((a, b) => b.seq - a.seq);
  //       return nextPlayers;
  //     });
  //   });

  //   // 실패했을경우 메시지
  //   socket.on("fail", (msg) => {
  //     setCheckMsg(msg);
  //     setInputValue("");
  //   });
  //   // 성공했을경우
  //   socket.on("pass", (data) => {
  //     setInputValue("");
  //     setWords((prev) => [...prev, data]);
  //   });
  //   // 유저가 보낸 문자열과 그걸보낸 유저닉네임, 성공실패 여부
  //   // 제시어
  //   socket.on("setInitial", (data) => {
  //     setGameMeta(data);
  //     setInputValue("");
  //   });
  // }, [socket]);

  // 1초가 지날때마다
  useEffect(() => {
    setInterval(() => {
      setGameTimeRemain((prev) => prev - 1);
    }, 1000);
  }, [gameMeta.gameTimeLimit]);

  const leftSide = players.filter((_, index) => index % 2 === 0);
  const rightSide = players.filter((_, index) => index % 2 !== 0);

  return (
    <div className={styles.gameContainer}>
      <div className={styles.suggestionContainer}>
        <div className={styles.suggestion}>{gameMeta.suggest}</div>
      </div>
      <div className={styles.playContainer}>
        <div className={styles.players}>
          <ul>
            {leftSide.map(({ id }) => {
              return (
                <li
                  style={{
                    backgroundColor: currentPlayerId === id ? "red" : "blue",
                  }}
                >
                  {id}
                </li>
              );
            })}
          </ul>
        </div>
        <div className={styles.chat}>
          <ul>
            {words.map((word) => {
              return <li>{word}</li>;
            })}
          </ul>
        </div>
        <div className={styles.players}>
          <ul>
            {rightSide.map(({ id }) => {
              return <li>{id}</li>;
            })}
          </ul>
        </div>
      </div>
      <div>
        <div className={styles.progressBar}></div>
      </div>
      <div className={styles.inputContainer}>
        <input
          className={styles.input}
          value={inputValue}
          onChange={changeValue}
        />
        <Button onClick={postWord}>제출</Button>
        <label>{checkMsg}</label>
      </div>
    </div>
  );
};

export default memo(Hunmin);
