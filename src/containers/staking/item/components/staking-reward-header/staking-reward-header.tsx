import { FC } from 'react';

import { useTranslation } from 'next-i18next';

import { ArrowDown } from '@components/svg/ArrowDown';
import { Button } from '@components/ui/elements/button';

import styles from './staking-reward-header.module.sass';

export const StakingRewardHeader: FC = () => {
  const { t } = useTranslation(['stake']);

  return (
    <>
      <Button href="/staking" theme="quaternary" icon className={styles.arrowButton}>
        <ArrowDown className={styles.backArrow} />
      </Button>
      <span>{t('stake|Back to the list')}</span>
    </>
  );
};
