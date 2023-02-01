import NoPositionImage from '@images/no-position.png';
import { useTranslation } from '@translation';

import styles from './empty-positions-list.module.scss';

export const EmptyPositionsList = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.listWrapper}>
      <img className={styles.illustration} alt="" src={NoPositionImage} />
      <h5 className={styles.notFoundLabel}>{t('liquidity|noPositionsText')}</h5>
    </div>
  );
};
