import { FC } from 'react';

import { Button } from '@shared/components';
import { ArrowDown } from '@shared/svg';
import { useTranslation } from '@translation';

import styles from './back-to-list-reward-header.module.scss';

interface BackToListRewardHeaderProps {
  backHref: string;
}

export const BackToListRewardHeader: FC<BackToListRewardHeaderProps> = ({ backHref }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <Button href={backHref} theme="quaternary" icon className={styles.arrowButton} data-test-id="backTTListButton">
        <ArrowDown className={styles.backArrow} />
      </Button>
      <span>{t('common|Back to the list')}</span>
    </div>
  );
};
