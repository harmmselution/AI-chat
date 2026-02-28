import type { ComponentPropsWithRef } from "react";
import classNames from "classnames/bind";
import styles from "./Button.module.scss";

const cx = classNames.bind(styles);

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
      className={cx("button", variant, className)}
      {...props}
    />
  );
};

