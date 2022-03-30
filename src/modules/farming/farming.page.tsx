import { FC } from 'react';

import { useTranslation } from 'next-i18next';

import { PageTitle } from '@shared/components';

export const Farming: FC = () => {
  const { t } = useTranslation(['common']);

  return <PageTitle>{t('Farming Page')}</PageTitle>;
};
