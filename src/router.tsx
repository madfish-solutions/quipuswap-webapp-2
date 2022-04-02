import { FC } from 'react';

import { Routes, Route } from 'react-router-dom';

import { Send, Swap } from '@modules/swap/swap.page';

import { Farming } from './modules/farming';
import { Home } from './modules/home';
import { Liquidity } from './modules/liquidity';
import { PrivacyPolicy } from './modules/privacy-policy';
import { TermsOfService } from './modules/terms-of-service';
import { Voting } from './modules/voting';

export const routes = {
  home: '/',
  privacyPolicy: 'privacy-policy',
  termsOfService: 'terms-of-service',
  liquidity: 'liquidity',
  swap: 'swap/*',
  send: 'send/*',
  farming: 'farming/*',
  voting: 'voting'
};

export const Router: FC = () => (
  <Routes>
    <Route path={routes.home} element={<Home />} />
    <Route path={routes.swap} element={<Swap />} />
    <Route path={routes.send} element={<Send />} />
    <Route path={routes.liquidity} element={<Liquidity />} />
    <Route path={routes.voting} element={<Voting />} />
    <Route path={routes.farming} element={<Farming />} />
    <Route path={routes.privacyPolicy} element={<PrivacyPolicy />} />
    <Route path={routes.termsOfService} element={<TermsOfService />} />
  </Routes>
);
