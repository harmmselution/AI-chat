import type { ComponentPropsWithRef } from "react";
import classNames from "classnames";
import styles from "./Input.module.scss";

type InputProps = ComponentPropsWithRef<"input">;

export const Input = ({ className, ref, ...props }: InputProps) => {
  return (
    <input
      ref={ref}
      className={classNames(styles.input, className)}
      {...props}
    />
  );
};

