import styles from "./LogoImg.module.scss";
import LOGO from "../../image/LOGO.png";

const LogoImg = () => {
  return (
    <div>
      <img className={styles.LogoImg} alt="MainLogo" src={LOGO} />
    </div>
  );
};

export default LogoImg;
