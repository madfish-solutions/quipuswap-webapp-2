import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { Route } from 'react-router-dom';

import { NewLiquidityFormTabs } from '@modules/new-liquidity/types';
import { StateWrapper } from '@shared/components';
import { SentryRoutes } from '@shared/services';

import { DexTwoAddLiq } from './dex-two-add-liq';
import { DexTwoClaimRewards } from './dex-two-claim-rewards';
import { DexTwoRemoveLiq } from './dex-two-remove-liq';
import { useCpmmViewModel } from './use-dex-two-item-page.vm';

export const Cpmm: FC = observer(() => {
  const { isInitialized, title } = useCpmmViewModel();

  return (
    <StateWrapper isLoading={!isInitialized} loaderFallback={<>Loading...</>}>
      <SentryRoutes>
        <Route path={`${NewLiquidityFormTabs.add}/:pairSlug`} element={<DexTwoAddLiq title={title} />} />
        <Route path={`${NewLiquidityFormTabs.remove}/:pairSlug`} element={<DexTwoRemoveLiq title={title} />} />
        <Route path={`${NewLiquidityFormTabs.claim}/:pairSlug`} element={<DexTwoClaimRewards title={title} />} />
      </SentryRoutes>
    </StateWrapper>
  );
});
