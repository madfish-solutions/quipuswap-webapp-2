import { FC } from 'react';

import { useParams } from 'react-router-dom';

import { NewLiquidityFormTabsCard } from '@modules/new-liquidity/components';
import { NewLiquidityFormTabs } from '@modules/new-liquidity/types';
import { PageTitle, StickyBlock } from '@shared/components';
import { useTranslation } from '@translation';

import { DexTwoRemoveLiqForm } from './components';

export const DexTwoRemoveLiq: FC = () => {
  const { t } = useTranslation();
  const { pairSlug } = useParams();

  return (
    <>
      <PageTitle data-test-id="dexTwoRemoveLiqTitle">
        {t('common|Remove')} {pairSlug}
      </PageTitle>
      <StickyBlock>
        <NewLiquidityFormTabsCard tabActiveId={NewLiquidityFormTabs.remove}>
          <DexTwoRemoveLiqForm />
        </NewLiquidityFormTabsCard>
      </StickyBlock>
    </>
  );
};
