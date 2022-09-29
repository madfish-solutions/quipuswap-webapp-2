import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { NewLiquidityFormTabsCard } from '@modules/new-liquidity/components';
import { NewLiquidityFormTabs } from '@modules/new-liquidity/types';
import { PageTitle, StateWrapper, StickyBlock } from '@shared/components';

import { DexTwoRemoveLiqForm } from './components';
import { useDexTwoItemPageViewModel } from './use-dex-two-item-page.vm';

export const DexTwoRemoveLiq: FC = observer(() => {
  const { t, title, isInitialized } = useDexTwoItemPageViewModel();

  return (
    <StateWrapper isLoading={!isInitialized} loaderFallback={<>Loading...</>}>
      <PageTitle data-test-id="dexTwoRemoveLiqTitle">
        {t('common|Remove')} {title}
      </PageTitle>

      <StickyBlock>
        <NewLiquidityFormTabsCard tabActiveId={NewLiquidityFormTabs.remove}>
          <DexTwoRemoveLiqForm />
        </NewLiquidityFormTabsCard>
      </StickyBlock>
    </StateWrapper>
  );
});
