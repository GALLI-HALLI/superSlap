import styles from "./SearchRoom.module.scss";
import classnames from "classnames";
import Button from "../common/Button";
import React, { useState } from "react";

type TSearchRoom = {
  open: boolean;
  close: () => void;
};

const SearchRoom = ({ open, close }: TSearchRoom) => {
  const [value, setValue] = useState("");

  const hanedleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <>
      <div
        className={classnames(
          styles.modal,
          open ? styles.openModal : styles.modal
        )}
      >
        {open ? (
          <div className={styles.section}>
            <div className={styles.header}>찾으시는 방코드를 입력해 주세요</div>
            <div className={styles.main}>
              <input
                className={styles.input}
                onChange={hanedleChange}
                value={value}
              />
              <button>입장하기</button>
            </div>
            <div className={styles.footer}>
              <Button className={styles.button} onClick={close}>
                close
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default SearchRoom;
