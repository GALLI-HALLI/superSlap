import React, { PropsWithChildren } from "react";
import styles from "./MainPage.module.scss";
import LogoImg from "../components/MainPage/LogoImg";

const MainPage = ({ children }: PropsWithChildren<{}>) => {
  return (
    <div className={styles.MainPage}>
      <LogoImg />
      {children}
    </div>
  );
};

export default MainPage;
