import styles from "./Loader.module.scss";

export const Loader = () => {
  return (
    <div className={styles.loader} aria-label="Loading">
      <span />
      <span />
      <span />
    </div>
  );
};

