import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { LiquidityFormTabsCard } from '@modules/liquidity/components';
import { PageTitle, StickyBlock } from '@shared/components';

import { NewLiquidityFormTabs } from '../../liquidity-routes.enum';
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
        <LiquidityFormTabsCard tabActiveId={NewLiquidityFormTabs.remove}>
          <DexTwoRemoveLiqForm />
        </LiquidityFormTabsCard>
        <DexTwoDetails />
      </StickyBlock>
    </>
  );
});
