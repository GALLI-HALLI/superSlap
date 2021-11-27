import React, { useState } from "react";
import { useSelector } from "../../hooks/typeReduxHook";
import Button from "../common/Button";
import styles from "./Hunmin.module.scss";

const Hunmin = () => {
  const [inputValue, setInputValue] = useState("");
  const metadata = useSelector((state) => state.room.metadata);

  const changeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className={styles.gameContainer}>
      <div className={styles.suggestionContainer}>
        <div className={styles.suggestion}>제시어</div>
      </div>
      <div className={styles.playContainer}>
        <div className={styles.players}>
          <ul>
            <li>ds</li>
            <li>ds</li>
            <li>ds</li>
            <li>ds</li>
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
        <Button>제출</Button>
      </div>
    </div>
  );
};

export default Hunmin;
