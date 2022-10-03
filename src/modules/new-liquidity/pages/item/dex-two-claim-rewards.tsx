import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { NewLiquidityFormTabsCard } from '@modules/new-liquidity/components';
import { NewLiquidityFormTabs } from '@modules/new-liquidity/types';
import { PageTitle, StickyBlock } from '@shared/components';
import { useTranslation } from '@translation';

import { DexTwoDetails } from './components';

export const DexTwoClaimRewards: FC<{ title: string }> = observer(({ title }) => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle data-test-id="dexTwoClaimRewardsTitle">
        {t('common|Add')} {title}
      </PageTitle>

      <StickyBlock>
        <NewLiquidityFormTabsCard tabActiveId={NewLiquidityFormTabs.claim}>lol</NewLiquidityFormTabsCard>
        <DexTwoDetails />
      </StickyBlock>
    </>
  );
});
