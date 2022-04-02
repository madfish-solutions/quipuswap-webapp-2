import { FC } from 'react';

import { PageTitle } from '@shared/components/page-title';
import { useTranslation } from '@translation';

export const Liquidity: FC = () => {
  const { t } = useTranslation(['common']);

  return <PageTitle>{t('Liquidity Page')}</PageTitle>;
};
