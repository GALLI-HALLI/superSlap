import LogoImg from "../components/MainPage/LogoImg";
import styles from "./lobbyPage.module.scss";

const lobbyPage = () => {
  return (
    <div className={styles.lobbyPageContainer}>
      <LogoImg />
      <div>
        <button></button>
      </div>
    </div>
  );
};

export default lobbyPage;
