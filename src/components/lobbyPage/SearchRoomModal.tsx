import styles from "./SearchRoom.module.scss";
import Button from "../common/Button";
import React, { useEffect, useState } from "react";
import { useSelector } from "../../hooks/typeReduxHook";
import { useDispatch } from "react-redux";
import { joinUser } from "../../store/room/room.action";
import { useHistory } from "react-router";
import { AsyncActionStatus } from "../../constants/redux";

type TSearchRoom = {
  close: () => void;
};

const SearchRoomModal = ({ close }: TSearchRoom) => {
  const [roomId, setRoomId] = useState("");
  const joinCheck = useSelector((state) => state.room.joinRoom);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (joinCheck.joinStatus === AsyncActionStatus.Success) {
      if (!joinCheck.message?.succuess) {
        alert(joinCheck.message?.msg);
      } else if (joinCheck.message?.succuess) {
        history.push(`/room/${roomId}`);
      }
    }
  }, [joinCheck, history, roomId]);

  const hanedleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomId(e.target.value);
  };

  const gotoRoom = () => {
    dispatch(joinUser({ roomId }));
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
            <Button className={styles.joinButton} onClick={gotoRoom}>
              입장하기
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchRoomModal;
