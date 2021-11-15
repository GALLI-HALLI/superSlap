import styles from "./LogoImg.module.scss";
import LOGO from "../../image/superSlapLogo.png";

const LogoImg = () => {
  return (
    <div>
      <img className={styles.logoImg} alt="MainLogo" src={LOGO} />
    </div>
  );
};

export default LogoImg;
