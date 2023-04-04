import { FC } from 'react';

import { Button } from '@shared/components';
import { ArrowDown } from '@shared/svg';
import { useTranslation } from '@translation';

import styles from './card-header-with-back-button.module.scss';

interface CardHeaderWithBackButtonProps {
  backHref: string;
  text?: string;
}

export const CardHeaderWithBackButton: FC<CardHeaderWithBackButtonProps> = ({ backHref, text }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <Button href={backHref} theme="quaternary" icon className={styles.arrowButton} data-test-id="backTTListButton">
        <ArrowDown className={styles.backArrow} />
      </Button>
      <span>{text ?? t('common|Back')}</span>
    </div>
  );
};
