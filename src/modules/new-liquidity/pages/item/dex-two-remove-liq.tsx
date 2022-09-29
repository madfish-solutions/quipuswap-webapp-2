import { FC } from 'react';

import { NewLiquidityFormTabsCard } from '@modules/new-liquidity/components';
import { NewLiquidityFormTabs } from '@modules/new-liquidity/types';
import { PageTitle, StickyBlock } from '@shared/components';

import { DexTwoRemoveLiqForm } from './components';
import { useDexTwoItemPageViewModel } from './use-dex-two-item-page.vm';

export const DexTwoRemoveLiq: FC = () => {
  const { t, title, isInitialize } = useDexTwoItemPageViewModel();

  return (
    <>
      <PageTitle data-test-id="dexTwoRemoveLiqTitle">
        {t('common|Remove')} {title}
      </PageTitle>
      {isInitialize && (
        <StickyBlock>
          <NewLiquidityFormTabsCard tabActiveId={NewLiquidityFormTabs.remove}>
            <DexTwoRemoveLiqForm />
          </NewLiquidityFormTabsCard>
        </StickyBlock>
      )}
    </>
  );
};
