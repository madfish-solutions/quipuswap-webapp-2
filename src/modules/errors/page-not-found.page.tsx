import { FC } from 'react';

import { PageTitle, TestnetAlert } from '@shared/components';
import { useTranslation } from '@translation';

import styles from './page-not-found.module.scss';

export const PageNotFoundPage: FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <TestnetAlert />
      <PageTitle>{t('common|Page Not Found')}</PageTitle>
      <div className={styles.statusCode}>404</div>
    </>
  );
};
