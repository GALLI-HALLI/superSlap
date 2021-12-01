import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Button from "../components/common/Button";
import SearchRoomModal from "../components/lobbyPage/SearchRoomModal";
import LogoImg from "../components/MainPage/LogoImg";
import { AsyncActionStatus } from "../constants/redux";
import useProfile from "../hooks/useProfile";
import { getRoomId } from "../store/room/room.action";
import { useSelector } from "../hooks/typeReduxHook";
import styles from "./LobbyPage.module.scss";
import { useHistory } from "react-router-dom";
import useRequestSuccess from "../hooks/useRequestSuccess";
import { resetProfile } from "../store/user/user.action";

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

  const isRoomRequestSucceed = useRequestSuccess(roomStatus);

  useEffect(() => {
    if (isRoomRequestSucceed) {
      history.push(`/room/${roomData}`);
    }
  }, [roomData, history, isRoomRequestSucceed]);

  const makeRoom = () => {
    dispatch(getRoomId());
  };

  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(resetProfile());
    history.replace("/");
    alert("로그아웃 되었습니다.");
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
        <Button onClick={handleLogout}>로그아웃</Button>
      </div>
    </div>
  );
};

export default LobbyPage;
