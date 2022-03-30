import { FC } from 'react';

import { useTranslation } from 'next-i18next';

import { PageTitle } from '@shared/components';

export const Liquidity: FC = () => {
  const { t } = useTranslation(['common']);

  return <PageTitle>{t('Liquidity Page')}</PageTitle>;
};
