import { FC } from 'react';

import { Button } from '@shared/components';
import { ArrowDown } from '@shared/svg';
import { useTranslation } from '@translation';

import styles from './form-header.module.scss';

interface Props {
  backHref: string;
}

export const FormHeader: FC<Props> = ({ backHref }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <Button href={backHref} theme="quaternary" icon className={styles.arrowButton} data-test-id="backTTListButton">
        <ArrowDown className={styles.backArrow} />
      </Button>
      <span>{t('common|Back')}</span>
    </div>
  );
};
