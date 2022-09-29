import { FC, useEffect } from 'react';

import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';

import { NewLiquidityFormTabsCard } from '@modules/new-liquidity/components';
import { useNewLiquidityItemStore } from '@modules/new-liquidity/hooks';
import { NewLiquidityFormTabs } from '@modules/new-liquidity/types';
import { PageTitle, StickyBlock } from '@shared/components';
import { useTranslation } from '@translation';

import { DexTwoAddLiqForm, DexTwoDetails } from './components';

export const DexTwoAddLiq: FC = observer(() => {
  const { t } = useTranslation();
  const { pairSlug } = useParams();
  const newLiquidityItemStore = useNewLiquidityItemStore();
  useEffect(() => {
    newLiquidityItemStore.setTokenPairSlug(pairSlug!);
    newLiquidityItemStore.itemSore.load();
  }, [newLiquidityItemStore, pairSlug]);

  return (
    <>
      <PageTitle data-test-id="dexTwoAddLiqTitle">
        {t('common|Add')} {pairSlug}
      </PageTitle>
      {newLiquidityItemStore.item && (
        <StickyBlock>
          <NewLiquidityFormTabsCard tabActiveId={NewLiquidityFormTabs.add}>
            <DexTwoAddLiqForm />
          </NewLiquidityFormTabsCard>
          <DexTwoDetails />
        </StickyBlock>
      )}
    </>
  );
});
