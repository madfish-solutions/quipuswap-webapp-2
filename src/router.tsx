import { FC } from 'react';

import { Route, Routes, Navigate } from 'react-router-dom';

import { PageNotFoundPage } from '@modules/errors';
import { Farming } from '@modules/farming';
import { Home } from '@modules/home';
import { Liquidity } from '@modules/liquidity';
import { PrivacyPolicy } from '@modules/privacy-policy';
import { StableswapLiquidityPage } from '@modules/stableswap';
import { Send, Swap } from '@modules/swap/swap.page';
import { TermsOfService } from '@modules/terms-of-service';
import { VotingPage } from '@modules/voting';

export const routes = {
  home: '/',
  privacyPolicy: '/privacy-policy',
  termsOfService: '/terms-of-service',
  liquidity: '/liquidity/*',
  swap: '/swap/*',
  send: '/send/*',
  farming: '/farming/*',
  voting: '/voting/*',
  stableswap: '/stableswap',
  stableswapLiquidity: '/stableswap/liquidity'
};

export const Router: FC = () => (
  <Routes>
    <Route path={routes.home} element={<Home />} />

    <Route path={routes.swap} element={<Swap />} />
    <Route path={routes.send} element={<Send />} />
    <Route path={routes.liquidity} element={<Liquidity />} />
    <Route path={routes.voting} element={<VotingPage />} />

    <Route path={routes.stableswapLiquidity} element={<StableswapLiquidityPage />} />
    <Route path={routes.stableswap} element={<Navigate replace to={routes.stableswapLiquidity} />} />

    <Route path={routes.farming} element={<Farming />} />

    <Route path={routes.privacyPolicy} element={<PrivacyPolicy />} />
    <Route path={routes.termsOfService} element={<TermsOfService />} />

    <Route path="*" element={<PageNotFoundPage />} />
  </Routes>
);
