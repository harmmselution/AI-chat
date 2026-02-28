import classNames from "classnames";
import { toast, type Toast as HotToast } from "react-hot-toast";
import styles from "./Toast.module.scss";

interface CustomToastProps {
  toastData: HotToast;
  message: string;
  type?: "error" | "success" | "info";
}

export const Toast = ({
  toastData,
  message,
  type = "info",
}: CustomToastProps) => {
  return (
    <div
      className={classNames(styles.toast, styles[type], {
        [styles.visible]: toastData.visible,
      })}
    >
      <div className={styles.content}>
        <span className={styles.message}>{message}</span>

        <button
          type="button"
          className={styles.closeButton}
          onClick={() => toast.dismiss(toastData.id)}
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
};

