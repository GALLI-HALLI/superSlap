import styles from "./SearchRoom.module.scss";
import Button from "../common/Button";
import React, { useState } from "react";

type TSearchRoom = {
  close: () => void;
};

const SearchRoomModal = ({ close }: TSearchRoom) => {
  const [roomId, setRoomId] = useState("");

  const hanedleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomId(e.target.value);
  };

  return (
    <>
      <div className={styles.modal}>
        <div className={styles.section}>
          <div className={styles.header}>찾으시는 방코드를 입력해 주세요</div>
          <div className={styles.main}>
            <input
              className={styles.input}
              onChange={hanedleChange}
              value={roomId}
            />
          </div>
          <div className={styles.footer}>
            <Button className={styles.closeButton} onClick={close}>
              닫기
            </Button>
            <Button className={styles.joinButton}>입장하기</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchRoomModal;
