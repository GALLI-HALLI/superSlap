import { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.scss";
import classnames from "classnames";

type TButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ className, ...props }: TButtonProps) => {
  return <button className={classnames(styles.button, className)} {...props} />;
};

export default Button;
