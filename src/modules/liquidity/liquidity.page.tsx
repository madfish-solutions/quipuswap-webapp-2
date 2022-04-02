import { FC } from 'react';

import { PageTitle } from '@shared/components/page-title';
import { useTranslation } from '@translation';

export const Liquidity: FC = () => {
  const { t } = useTranslation(['common']);

  //@ts-ignore
  return <PageTitle>{t('Liquidity Page')}</PageTitle>;
};
