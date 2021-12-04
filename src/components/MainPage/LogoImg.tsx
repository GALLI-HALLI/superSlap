import styles from "./LogoImg.module.scss";
import LOGO from "../../image/slapLogo.png";

const LogoImg = () => {
  return (
    <div className={styles.logoContainer}>
      <img className={styles.logoImg} alt="MainLogo" src={LOGO} />
      <label className={styles.name}>SUPER SLAP</label>
    </div>
  );
};

export default LogoImg;
