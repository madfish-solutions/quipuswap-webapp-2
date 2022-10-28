import { FC } from 'react';

import { NewLiquidityFormTabsCard } from '@modules/new-liquidity/components';
import { NewLiquidityFormTabs } from '@modules/new-liquidity/types';
import { PageTitle, StickyBlock } from '@shared/components';
import { useTranslation } from '@translation';

import { DexTwoClaimRewardsFrom, DexTwoDetails } from './components';

export const CpmmDexTwoClaimRewards: FC<{ title: string }> = ({ title }) => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle data-test-id="dexTwoClaimRewardsTitle">
        {t('common|Add')} {title}
      </PageTitle>

      <StickyBlock>
        <NewLiquidityFormTabsCard tabActiveId={NewLiquidityFormTabs.claim}>
          <DexTwoClaimRewardsFrom />
        </NewLiquidityFormTabsCard>
        <DexTwoDetails />
      </StickyBlock>
    </>
  );
};
