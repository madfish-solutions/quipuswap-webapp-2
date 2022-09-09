import { FC } from 'react';

import { useParams } from 'react-router-dom';

import { NewLiquidityFormTabsCard } from '@modules/new-liquidity/components';
import { NewLiquidityFormTabs } from '@modules/new-liquidity/types';
import { PageTitle, StickyBlock } from '@shared/components';
import { useTranslation } from '@translation';

import { DexTwoAddLiqForm, DexTwoDetails } from './components';

export const DexTwoAddLiq: FC = () => {
  const { t } = useTranslation();
  const { pairSlug } = useParams();

  return (
    <>
      <PageTitle data-test-id="dexTwoAddLiqTitle">
        {t('common|Add')} {pairSlug}
      </PageTitle>
      <StickyBlock>
        <NewLiquidityFormTabsCard tabActiveId={NewLiquidityFormTabs.add}>
          <DexTwoAddLiqForm />
        </NewLiquidityFormTabsCard>
        <DexTwoDetails />
      </StickyBlock>
    </>
  );
};
