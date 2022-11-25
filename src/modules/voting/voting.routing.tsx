import { FC } from 'react';

import { Route } from 'react-router-dom';

import { NOT_FOUND_ROUTE_NAME } from '@config/constants';
import { PageNotFoundPage } from '@modules/errors';
import { SentryRoutes } from '@shared/services';

import { VotingPage } from './voting.page';

export const VotingRouter: FC = () => (
  <SentryRoutes>
    <Route path="/" element={<VotingPage />} />
    <Route path={`/${NOT_FOUND_ROUTE_NAME}`} element={<PageNotFoundPage />} />
    <Route path={`/:method/${NOT_FOUND_ROUTE_NAME}`} element={<PageNotFoundPage />} />
    <Route path=":method/:fromTo" element={<VotingPage />} />
  </SentryRoutes>
);
