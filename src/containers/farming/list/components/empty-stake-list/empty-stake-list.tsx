import { TokenNotFound } from '@quipuswap/ui-kit';

import styles from './empty-stake-list.module.scss';

const NO_DATA = 'No Data!';

export const EmptyFarmingList = () => {
  return (
    <div className={styles.listWrapper}>
      <TokenNotFound />
      <h5 className={styles.notFoundLabel}>{NO_DATA}</h5>
    </div>
  );
};
