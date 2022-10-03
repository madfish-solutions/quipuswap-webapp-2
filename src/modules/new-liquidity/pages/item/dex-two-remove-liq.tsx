import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { NewLiquidityFormTabsCard } from '@modules/new-liquidity/components';
import { NewLiquidityFormTabs } from '@modules/new-liquidity/types';
import { PageTitle, StickyBlock } from '@shared/components';
import { useTranslation } from '@translation';

import { DexTwoDetails, DexTwoRemoveLiqForm } from './components';

export const DexTwoRemoveLiq: FC<{ title: string }> = observer(({ title }) => {
  const { t } = useTranslation();

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
