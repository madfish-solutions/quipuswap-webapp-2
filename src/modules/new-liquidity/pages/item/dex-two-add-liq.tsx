import { FC } from 'react';

import { useParams } from 'react-router-dom';

import { PageTitle } from '@shared/components';
import { useTranslation } from '@translation';

export const DexTwoAddLiq: FC = () => {
  const { t } = useTranslation();
  const { pairSlug } = useParams();

  return (
    <>
      <PageTitle data-test-id="dexTwoAddLiqTitle">
        {t('newLiquidity|Add')} {pairSlug}
      </PageTitle>
    </>
  );
};
