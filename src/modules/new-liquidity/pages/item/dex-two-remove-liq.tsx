import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { NewLiquidityFormTabsCard } from '@modules/new-liquidity/components';
import { NewLiquidityFormTabs } from '@modules/new-liquidity/types';
import { PageTitle, StickyBlock } from '@shared/components';

import { DexTwoDetails, DexTwoRemoveLiqForm } from './components';
import { useDexTwoItemViewModel } from './dex-two-item.vm';

export const DexTwoRemoveLiq: FC = observer(() => {
  const { t, title } = useDexTwoItemViewModel();

  return (
    <>
      <PageTitle data-test-id="dexTwoRemoveLiqTitle">
        {t('common|Remove')} {title}
      </PageTitle>

      <StickyBlock>
        <NewLiquidityFormTabsCard tabActiveId={NewLiquidityFormTabs.remove}>
          <DexTwoRemoveLiqForm />
        </NewLiquidityFormTabsCard>
        <DexTwoDetails />
      </StickyBlock>
    </>
  );
});
