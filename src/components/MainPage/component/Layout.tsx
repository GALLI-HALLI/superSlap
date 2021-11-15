import React, { PropsWithChildren } from "react";
import styles from "./Layout.module.scss";

const Layout = ({ children }: PropsWithChildren<{}>) => {
  return <div className={styles.layout}>{children}</div>;
};

export default Layout;
