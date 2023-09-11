import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { LiquidityFormTabsCard } from '@modules/liquidity/components';
import { PageTitle, StickyBlock } from '@shared/components';

import { DexTwoDetails, DexTwoRemoveLiqForm } from './components';
import { useDexTwoItemViewModel } from './dex-two-item.vm';
import { LiquidityTabs } from '../../liquidity-routes.enum';

export const DexTwoRemoveLiq: FC = observer(() => {
  const { t, title } = useDexTwoItemViewModel();

  return (
    <>
      <PageTitle data-test-id="dexTwoRemoveLiqTitle">
        {t('common|Remove')} {title}
      </PageTitle>

      <StickyBlock>
        <LiquidityFormTabsCard tabActiveId={LiquidityTabs.remove}>
          <DexTwoRemoveLiqForm />
        </LiquidityFormTabsCard>
        <DexTwoDetails />
      </StickyBlock>
    </>
  );
});
