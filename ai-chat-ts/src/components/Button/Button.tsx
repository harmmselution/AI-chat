import type { ComponentPropsWithRef } from "react";
import classNames from "classnames";
import styles from "./Button.module.scss";

type ButtonProps = ComponentPropsWithRef<"button"> & {
  variant?: "primary" | "secondary";
};

export const Button = ({
  variant = "primary",
  className,
  ref,
  ...props
}: ButtonProps) => {
  return (
    <button
      ref={ref}
      className={classNames(styles.button, styles[variant], className)}
      {...props}
    />
  );
};