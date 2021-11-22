import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import SearchRoomModal from "../components/lobbyPage/SearchRoomModal";
import LogoImg from "../components/MainPage/LogoImg";
import { AsyncActionStatus } from "../constants/redux";
import useProfile from "../hooks/useProfile";
import { getRoomId } from "../store/room/room.action";
import { useSelector } from "../hooks/typeReduxHook";
import styles from "./LobbyPage.module.scss";
import { useHistory } from "react-router-dom";

const LobbyPage = () => {
  const [showModal, setShowModal] = useState(false);
  const { data, status } = useProfile({ blockAccess: true });
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    roomId: { roomData, roomStatus },
  } = useSelector((store) => ({
    roomId: store.room.roomId,
  }));

  useEffect(() => {
    if (roomStatus === AsyncActionStatus.Success) {
      history.replace(`/room/${roomData}`);
    }
  }, [roomStatus, roomData, history]);

  const makeRoom = () => {
    dispatch(getRoomId());
  };

  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  if (status === AsyncActionStatus.Loading) {
    return <div>로딩중입니다.</div>;
  }

  return (
    <div className={styles.lobbyPageContainer}>
      <LogoImg />
      <div>{showModal && <SearchRoomModal close={closeModal} />}</div>
      <div>어서오세요, {data?.name}님</div>
      <div className={styles.buttonContainer}>
        <Button onClick={makeRoom}>방만들기</Button>
        <Button onClick={openModal}>방찾기</Button>
        <Link to="/my-info">
          <Button>내정보</Button>
        </Link>
      </div>
    </div>
  );
};

export default LobbyPage;
