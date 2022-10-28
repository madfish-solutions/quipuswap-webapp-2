import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { Route } from 'react-router-dom';

import { StateWrapper } from '@shared/components';
import { SentryRoutes } from '@shared/services';

import { NewLiquidityFormTabs } from '../../liquidity-routes.enum';
import { CpmmNewLiquidityCreatePage } from '../create';
import { CpmmDexTwoClaimRewards } from './cpmm-dex-two-claim-rewards';
import { DexTwoAddLiq } from './dex-two-add-liq';
import { DexTwoRemoveLiq } from './dex-two-remove-liq';
import { useCpmmViewModel } from './use-dex-two-item-page.vm';

export const CpmmPageRouter: FC = observer(() => {
  const { isInitialized, title } = useCpmmViewModel();

  return (
    <StateWrapper isLoading={!isInitialized} loaderFallback={<>Loading...</>}>
      <SentryRoutes>
        <Route path={`${NewLiquidityFormTabs.add}/:pairSlug`} element={<DexTwoAddLiq />} />
        <Route path={`${NewLiquidityFormTabs.remove}/:pairSlug`} element={<DexTwoRemoveLiq />} />
        <Route path={`${NewLiquidityFormTabs.claim}/:pairSlug`} element={<CpmmDexTwoClaimRewards title={title} />} />
        <Route path={`${NewLiquidityFormTabs.create}`} element={<CpmmNewLiquidityCreatePage />} />
      </SentryRoutes>
    </StateWrapper>
  );
});
