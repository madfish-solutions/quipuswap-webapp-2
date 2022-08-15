import { FC } from 'react';

import { Route, Routes } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { CoinflipPage } from '@modules/coinflip';
import { PageNotFoundPage } from '@modules/errors';
import { FarmingPage } from '@modules/farming';
import { HomePage } from '@modules/home';
import { LiquidityPage } from '@modules/liquidity';
import { NewLiquidityPageRouter } from '@modules/new-liquidity';
import { PrivacyPolicyPage } from '@modules/privacy-policy';
import { StableswapRouter } from '@modules/stableswap/stableswap.routing';
import { SendPage, SwapPage } from '@modules/swap/swap.page';
import { TermsOfServicePage } from '@modules/terms-of-service';
import { VotingPage } from '@modules/voting';

export const AppRouter: FC = () => (
  <Routes>
    <Route path={AppRootRoutes.Root} element={<HomePage />} />

    <Route path={`${AppRootRoutes.Swap}/*`} element={<SwapPage />} />
    <Route path={`${AppRootRoutes.Send}/*`} element={<SendPage />} />

    <Route path={`${AppRootRoutes.Liquidity}/*`} element={<LiquidityPage />} />
    <Route path={`${AppRootRoutes.NewLiquidity}/*`} element={<NewLiquidityPageRouter />} />

    <Route path={`${AppRootRoutes.Stableswap}/*`} element={<StableswapRouter />} />

    <Route path={`${AppRootRoutes.Farming}/*`} element={<FarmingPage />} />
    <Route path={`${AppRootRoutes.Voting}/*`} element={<VotingPage />} />
    <Route path={`${AppRootRoutes.Coinflip}/*`} element={<CoinflipPage />} />

    <Route path={AppRootRoutes.PrivacyPolicy} element={<PrivacyPolicyPage />} />
    <Route path={AppRootRoutes.TermsOfService} element={<TermsOfServicePage />} />

    <Route path="*" element={<PageNotFoundPage />} />
  </Routes>
);
