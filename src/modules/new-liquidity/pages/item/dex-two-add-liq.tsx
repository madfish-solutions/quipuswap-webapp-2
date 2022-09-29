import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { NewLiquidityFormTabsCard } from '@modules/new-liquidity/components';
import { NewLiquidityFormTabs } from '@modules/new-liquidity/types';
import { PageTitle, StateWrapper, StickyBlock } from '@shared/components';

import { DexTwoAddLiqForm, DexTwoDetails } from './components';
import { useDexTwoItemPageViewModel } from './use-dex-two-item-page.vm';

export const DexTwoAddLiq: FC = observer(() => {
  const { t, title, isInitialized } = useDexTwoItemPageViewModel();

  return (
    <StateWrapper isLoading={!isInitialized} loaderFallback={<>Loading...</>}>
      <PageTitle data-test-id="dexTwoAddLiqTitle">
        {t('common|Add')} {title}
      </PageTitle>

      <StickyBlock>
        <NewLiquidityFormTabsCard tabActiveId={NewLiquidityFormTabs.add}>
          <DexTwoAddLiqForm />
        </NewLiquidityFormTabsCard>
        <DexTwoDetails />
      </StickyBlock>
    </StateWrapper>
  );
});
