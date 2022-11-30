import styles from './empty-positions-list.module.scss';

export const EmptyPositionsList = () => {
  return (
    <div className={styles.listWrapper}>
      <h5 className={styles.notFoundLabel}>Here can be your positions.</h5>
    </div>
  );
};
