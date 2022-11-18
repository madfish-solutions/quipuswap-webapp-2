import { FC } from 'react';

import { Route } from 'react-router-dom';

import { NOT_FOUND_ROUTE_NAME } from '@config/constants';
import { PageNotFoundPage } from '@modules/errors';
import { SentryRoutes } from '@shared/services';
import { SwapTabAction } from '@shared/types';

import { SwapSend } from './swap-send';

export const SwapPage: FC = () => {
  return (
    <SentryRoutes>
      <Route path="/" element={<SwapSend initialAction={SwapTabAction.SWAP} />} />
      <Route path={NOT_FOUND_ROUTE_NAME} element={<PageNotFoundPage />} />
      <Route path=":fromTo" element={<SwapSend initialAction={SwapTabAction.SWAP} />} />
    </SentryRoutes>
  );
};

export const SendPage: FC = () => {
  return (
    <SentryRoutes>
      <Route path="/" element={<SwapSend initialAction={'send' as SwapTabAction} />} />
      <Route path={NOT_FOUND_ROUTE_NAME} element={<PageNotFoundPage />} />
      <Route path=":fromTo" element={<SwapSend initialAction={'send' as SwapTabAction} />} />
    </SentryRoutes>
  );
};
