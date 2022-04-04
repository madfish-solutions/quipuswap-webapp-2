import { FC } from 'react';

import { useTranslation } from 'next-i18next';

import { ArrowDown } from '@components/svg/ArrowDown';
import { Button } from '@components/ui/elements/button';

import styles from './farming-reward-header.module.sass';

export const FarmingRewardHeader: FC = () => {
  const { t } = useTranslation(['farm']);

  return (
    <>
      <Button href="/farming" theme="quaternary" icon className={styles.arrowButton}>
        <ArrowDown className={styles.backArrow} />
      </Button>
      <span>{t('farm|Back to the list')}</span>
    </>
  );
};
