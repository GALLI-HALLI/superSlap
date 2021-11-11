import React, { InputHTMLAttributes, useEffect, useState } from "react";
import { unPack } from "../../utils/util";
import styles from "./FormInput.module.scss";

type TFormInputProps = {
  label: string;
  onChange?: ({ value, isValid }: { value: string; isValid: boolean }) => void;
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

  console.log(styles);

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
      <div>{getMessage()}</div>
    </div>
  );
};

export default FormInput;
