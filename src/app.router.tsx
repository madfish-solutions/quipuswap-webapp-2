import { FC } from 'react';

import { Route } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { CoinflipPage } from '@modules/coinflip';
import { PageNotFoundPage } from '@modules/errors';
import { FarmingRouter } from '@modules/farming';
import { HomePage } from '@modules/home';
import { NewLiquidityPageRouter } from '@modules/new-liquidity';
import { PrivacyPolicyPage } from '@modules/privacy-policy';
import { StableswapRouter } from '@modules/stableswap/stableswap.routing';
import { SendPage, SwapPage } from '@modules/swap/swap.page';
import { TermsOfServicePage } from '@modules/terms-of-service';
import { VotingPage } from '@modules/voting';
import { SentryRoutes } from '@shared/services';

export const AppRouter: FC = () => (
  <SentryRoutes>
    <Route path={AppRootRoutes.Root} element={<HomePage />} />

    <Route path={`${AppRootRoutes.Swap}/*`} element={<SwapPage />} />
    <Route path={`${AppRootRoutes.Send}/*`} element={<SendPage />} />

    <Route path={`${AppRootRoutes.Liquidity}/*`} element={<NewLiquidityPageRouter />} />

    <Route path={`${AppRootRoutes.Stableswap}/*`} element={<StableswapRouter />} />

    <Route path={`${AppRootRoutes.Farming}/*`} element={<FarmingRouter />} />
    <Route path={`${AppRootRoutes.Voting}/*`} element={<VotingPage />} />
    <Route path={`${AppRootRoutes.Coinflip}/*`} element={<CoinflipPage />} />

    <Route path={AppRootRoutes.PrivacyPolicy} element={<PrivacyPolicyPage />} />
    <Route path={AppRootRoutes.TermsOfService} element={<TermsOfServicePage />} />

    <Route path="*" element={<PageNotFoundPage />} />
  </SentryRoutes>
);
