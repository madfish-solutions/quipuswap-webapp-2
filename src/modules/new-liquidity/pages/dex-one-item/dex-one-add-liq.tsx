import { FC } from 'react';

import { useParams } from 'react-router-dom';

import { PageTitle } from '@shared/components';
import { useTranslation } from '@translation';

export const DexOneAddLiq: FC = () => {
  const { t } = useTranslation();
  const { pairSlug } = useParams();

  return (
    <>
      <PageTitle data-test-id="dexOneAddLiqTitle">
        {t('common|Add')} {pairSlug}
      </PageTitle>
    </>
  );
};
