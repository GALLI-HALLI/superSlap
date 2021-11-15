import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import SearchRoom from "../components/lobbyPage/SearchRoom";
import LogoImg from "../components/MainPage/LogoImg";
import styles from "./lobbyPage.module.scss";

const LobbyPage = () => {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal((prev) => (prev = true));
  };
  const closeModal = () => {
    setShowModal((prev) => (prev = false));
  };

  return (
    <div className={styles.lobbyPageContainer}>
      <LogoImg />
      <div>
        <SearchRoom open={showModal} close={closeModal} />
      </div>
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
