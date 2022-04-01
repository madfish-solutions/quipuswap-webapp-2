import { NotFound } from '@shared/svg';

import styles from './empty-farming-list.module.scss';

const NO_DATA = 'No Data!';

export const EmptyFarmingList = () => {
  return (
    <div className={styles.listWrapper}>
      <NotFound />
      <h5 className={styles.notFoundLabel}>{NO_DATA}</h5>
    </div>
  );
};
