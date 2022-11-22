import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { Route } from 'react-router-dom';

import { LoaderFallback, StateWrapper } from '@shared/components';
import { SentryRoutes } from '@shared/services';

import { LiquidityTabs } from '../../liquidity-routes.enum';
import { LiquidityCreatePage } from '../create';
import { CpmmDexTwoClaimRewards } from './cpmm-dex-two-claim-rewards';
import { DexTwoAddLiq } from './dex-two-add-liq';
import { DexTwoRemoveLiq } from './dex-two-remove-liq';
import { useCpmmViewModel } from './use-dex-two-item-page.vm';

export const CpmmPageRouter: FC = observer(() => {
  const { isInitialized, title } = useCpmmViewModel();

  return (
    <StateWrapper isLoading={!isInitialized} loaderFallback={<LoaderFallback />}>
      <SentryRoutes>
        <Route path={`${LiquidityTabs.add}/:pairSlug`} element={<DexTwoAddLiq />} />
        <Route path={`${LiquidityTabs.remove}/:pairSlug`} element={<DexTwoRemoveLiq />} />
        <Route path={`${LiquidityTabs.claim}/:pairSlug`} element={<CpmmDexTwoClaimRewards title={title} />} />
        <Route path={`${LiquidityTabs.create}`} element={<LiquidityCreatePage />} />
      </SentryRoutes>
    </StateWrapper>
  );
});
