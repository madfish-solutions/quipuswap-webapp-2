import { NotFound } from '@shared/svg';
import { useTranslation } from '@translation';

import styles from './empty-positions-list.module.scss';

export const EmptyPositionsList = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.listWrapper}>
      <NotFound />
      <h5 className={styles.notFoundLabel}>{t('liquidity|noPositionsText')}</h5>
    </div>
  );
};
