import { FC } from 'react';

import { Button } from '@shared/components';
import { ArrowDown } from '@shared/svg';
import { useTranslation } from '@translation';

import styles from './youves-reward-header.module.scss';

export const YouvesRewardHeader: FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <Button href="/farming" theme="quaternary" icon className={styles.arrowButton} data-test-id="backTTListButton">
        <ArrowDown className={styles.backArrow} />
      </Button>
      <span>{t('farm|Back to the list')}</span>
    </div>
  );
};
