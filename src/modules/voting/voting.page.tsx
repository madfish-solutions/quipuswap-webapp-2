import { FC } from 'react';

import { PageTitle } from '@shared/components/page-title';
import { useTranslation } from '@translation';

export const Voting: FC = () => {
  const { t } = useTranslation(['common']);

  //@ts-ignore
  return <PageTitle>{t('Voting Page')}</PageTitle>;
};
