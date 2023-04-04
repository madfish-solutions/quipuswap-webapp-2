import { FC } from 'react';

import { Button } from '@shared/components';
import { ArrowDown } from '@shared/svg';
import { useTranslation } from '@translation';

import styles from './farming-reward-header.module.scss';

export const FarmingRewardHeader: FC = () => {
  const { t } = useTranslation(['farm']);

  return (
    <div className={styles.root}>
      <Button href="/farming" theme="quaternary" icon className={styles.arrowButton} data-test-id="backTTListButton">
        <ArrowDown className={styles.backArrow} />
      </Button>
      <span>{t('common|Back to the list')}</span>
    </div>
  );
};
