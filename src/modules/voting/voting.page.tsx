import { FC } from 'react';

import { PageTitle } from '@shared/components/page-title';
import { useTranslation } from '@shared/hooks';

export const Voting: FC = () => {
  const { t } = useTranslation(['common']);

  return <PageTitle>{t('Voting Page')}</PageTitle>;
};
