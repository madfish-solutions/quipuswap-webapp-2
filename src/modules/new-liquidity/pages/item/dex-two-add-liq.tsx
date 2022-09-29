import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { NewLiquidityFormTabsCard } from '@modules/new-liquidity/components';
import { NewLiquidityFormTabs } from '@modules/new-liquidity/types';
import { PageTitle, StickyBlock } from '@shared/components';

import { DexTwoAddLiqForm, DexTwoDetails } from './components';
import { useDexTwoItemPageViewModel } from './use-dex-two-item-page.vm';

export const DexTwoAddLiq: FC = observer(() => {
  const { t, title, isInitialize } = useDexTwoItemPageViewModel();

  return (
    <>
      <PageTitle data-test-id="dexTwoAddLiqTitle">
        {t('common|Add')} {title}
      </PageTitle>
      {isInitialize && (
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
