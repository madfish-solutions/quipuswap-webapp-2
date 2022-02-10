import { TokenNotFound } from '@quipuswap/ui-kit';

import styles from './stake-list-error.module.scss';

const NO_DATA = 'No Data!';

export const StakeListError = () => {
  return (
    <div className={styles.listWrapper}>
      <TokenNotFound />
      <h5 className={styles.notFoundLabel}>{NO_DATA}</h5>
    </div>
  );
};
