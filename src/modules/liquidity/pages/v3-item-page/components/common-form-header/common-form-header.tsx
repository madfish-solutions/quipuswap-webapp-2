import { FC } from 'react';

import { Button } from '@shared/components';
import { ArrowDown } from '@shared/svg';
import { useTranslation } from '@translation';

import styles from './common-form-header.module.scss';

interface Props {
  href: string;
}

export const CommonFormHeader: FC<Props> = ({ href }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <Button href={href} theme="quaternary" icon className={styles.arrowButton} data-test-id="backArrow">
        <ArrowDown className={styles.backArrow} />
      </Button>
      <span>{t('common|Back')}</span>
    </div>
  );
};
