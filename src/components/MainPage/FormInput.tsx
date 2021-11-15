import React, { InputHTMLAttributes, useEffect, useState } from "react";
import { unPack } from "../../utils/promise";
import styles from "./FormInput.module.scss";
import classnames from "classnames";

type TFormInputProps = {
  label: string;
  onChange?: (data: { value: string; isValid: boolean }) => void;
  message?: { valid: string; invalid: string };
  validator?: (value: string) => Promise<boolean> | boolean;
  // 인풋 앨리먼트가 가지고있는 prop중 onChange를 제외하고 타입선언
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">;

enum ValidStatus {
  Idle = "Idle",
  Edited = "Edited",
  Invalid = "Invalid",
  Valid = "Valid",
}

const FormInput = ({
  label,
  onChange,
  message,
  validator,
  ...props
}: TFormInputProps) => {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState(ValidStatus.Idle);

  const hanedleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (status === ValidStatus.Idle) {
      setStatus(ValidStatus.Edited);
    }
  };

  const getMessage = () => {
    if (!message) {
      return null;
    }
    // value가 없다면 안내문구 글귀 제거
    if (value.length === 0) {
      return null;
    }
    if ([ValidStatus.Idle, ValidStatus.Edited].includes(status)) {
      return null;
    }
    return status === ValidStatus.Valid ? message.valid : message.invalid;
  };

  useEffect(() => {
    if (status !== ValidStatus.Idle && validator) {
      unPack(validator(value)).then((result) => {
        setStatus(result ? ValidStatus.Valid : ValidStatus.Invalid);
      });
    }
  }, [value, validator, status]);

  useEffect(() => {
    onChange?.({
      value,
      isValid: status === ValidStatus.Valid,
    });
  }, [value, status, onChange]);

  return (
    <div className={styles.inputContainer}>
      {label && (
        <label className={styles.inputLabel} htmlFor={props.name}>
          {label}
        </label>
      )}
      <input
        value={value}
        className={styles.inputBox}
        onChange={hanedleChange}
        {...props}
      />
      <div
        className={classnames(
          styles.inputHint,
          status === ValidStatus.Invalid
            ? styles.inputHintRed
            : styles.inputHintBlack
        )}
      >
        {getMessage()}
      </div>
    </div>
  );
};

export default FormInput;
