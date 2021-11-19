import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import SearchRoomModal from "../components/lobbyPage/SearchRoomModal";
import LogoImg from "../components/MainPage/LogoImg";
import { AsyncActionStatus } from "../constants/redux";
import useProfile from "../hooks/useProfile";
import styles from "./LobbyPage.module.scss";

const LobbyPage = () => {
  const [showModal, setShowModal] = useState(false);
  const { data, status } = useProfile({ blockAccess: true });

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
        <Button>방만들기</Button>
        <Button onClick={openModal}>방찾기</Button>
        <Link to="/my-info">
          <Button>내정보</Button>
        </Link>
      </div>
    </div>
  );
};

export default LobbyPage;
