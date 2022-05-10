import { FC } from 'react';

import { Button } from '@shared/components';
import { ArrowDown } from '@shared/svg';
import { useTranslation } from '@translation';

import styles from './form-header.module.scss';

export const FormHeader: FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <Button
        href="/stableswap/liquidity"
        theme="quaternary"
        icon
        className={styles.arrowButton}
        data-test-id="backTTListButton"
      >
        <ArrowDown className={styles.backArrow} />
      </Button>
      <span>{t('farm|Back to the list')}</span>
    </div>
  );
};
