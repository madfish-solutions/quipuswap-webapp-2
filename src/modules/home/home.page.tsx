import { FC } from 'react';

import { useTranslation } from 'next-i18next';

import { PageTitle } from '@shared/components';

export const Home: FC = () => {
  const { t } = useTranslation(['common']);

  return <PageTitle>{t('Home Page')}</PageTitle>;
};
