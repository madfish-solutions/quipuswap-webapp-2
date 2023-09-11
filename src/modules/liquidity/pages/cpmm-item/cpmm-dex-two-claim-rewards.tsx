import { FC } from 'react';

import { LiquidityFormTabsCard } from '@modules/liquidity/components';
import { PageTitle, StickyBlock } from '@shared/components';
import { useTranslation } from '@translation';

import { DexTwoClaimRewardsFrom, DexTwoDetails } from './components';
import { LiquidityTabs } from '../../liquidity-routes.enum';

export const CpmmDexTwoClaimRewards: FC<{ title: string }> = ({ title }) => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle data-test-id="dexTwoClaimRewardsTitle">
        {t('common|Add')} {title}
      </PageTitle>

      <StickyBlock>
        <LiquidityFormTabsCard tabActiveId={LiquidityTabs.claim}>
          <DexTwoClaimRewardsFrom />
        </LiquidityFormTabsCard>
        <DexTwoDetails />
      </StickyBlock>
    </>
  );
};
