import React, { memo, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { TPlayer } from "../../types/api";
import Button from "../common/Button";
import styles from "./Hunmin.module.scss";

type TSocket = {
  socket: Socket;
  players: Record<string, TPlayer>;
};

const Hunmin = ({ socket, players }: TSocket) => {
  const [inputValue, setInputValue] = useState("");
  const [suggest, setSuggest] = useState("");
  const [checkMsg, setCheckMsg] = useState("");
  const changeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const gamerList = Object.values(players);

  const postWord = () => {
    socket.emit("word", inputValue);
  };

  socket.on("join_user", (data) => {
    console.log(data);
  });

  useEffect(() => {
    socket.on("fail", (msg) => {
      console.log(msg);
      setCheckMsg(msg);
      setInputValue("");
    });
    socket.on("pass", (data) => {
      console.log(data);
      setInputValue("");
    });
    socket.on("suggestInitial", (data) => {
      setSuggest(data);
      setInputValue("");
    });
  });

  return (
    <div className={styles.gameContainer}>
      <div className={styles.suggestionContainer}>
        Ma7kZEU <div className={styles.suggestion}>{suggest}</div>
      </div>
      <div className={styles.playContainer}>
        <div className={styles.players}>
          <ul>
            {gamerList.map(({ nickname }) => (
              <li>{nickname}</li>
            ))}
          </ul>
        </div>
        <div className={styles.chat}>
          <ul>
            <li>ds</li>
            <li>ds</li>
            <li>ds</li>
            <li>ds</li>
          </ul>
        </div>
        <div className={styles.players}>
          <ul>
            <li>ds</li>
            <li>ds</li>
            <li>ds</li>
            <li>ds</li>
          </ul>
        </div>
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
