import { FC } from 'react';

import { useTranslation } from 'next-i18next';

import { PageTitle } from '@shared/components/page-title';

export const Swap: FC = () => {
  const { t } = useTranslation(['common']);

  return <PageTitle>{t('Swap Page')}</PageTitle>;
};
