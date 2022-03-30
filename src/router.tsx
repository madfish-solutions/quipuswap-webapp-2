import { FC } from 'react';

import { Routes, Route } from 'react-router-dom';

import { PrivacyPolicy } from './modules/privacy-policy';
import { TermsOfService } from './modules/terms-of-service';

export const routes = {
  home: '/',
  privacyPolicy: 'privacy-policy',
  termsOfService: 'terms-of-service',
  liquidity: 'liquidity',
  swap: 'swap',
  send: 'send',
  farming: 'farming',
  voting: 'voting'
};

export const Router: FC = () => (
  <Routes>
    <Route path={routes.home} element={<h1>Main page</h1>} />
    <Route path={routes.privacyPolicy} element={<PrivacyPolicy />} />
    <Route path={routes.termsOfService} element={<TermsOfService />} />
  </Routes>
);
