import { FC } from 'react';

import { Route } from 'react-router-dom';

import { NOT_FOUND_ROUTE_NAME } from '@config/constants';
import { PageNotFoundPage } from '@modules/errors';
import { LoaderFallback, StateWrapper } from '@shared/components';
import { SentryRoutes } from '@shared/services';
import { CFC, SwapTabAction } from '@shared/types';

import { SwapSend } from './swap-send';
import { useSwapOrSendPageViewModel } from './use-swap-or-send-page.vm';

const SwapOrSendPage: CFC = ({ children }) => {
  const { isInitialized } = useSwapOrSendPageViewModel();

  return (
    <StateWrapper isLoading={!isInitialized} loaderFallback={<LoaderFallback />}>
      <SentryRoutes>{children}</SentryRoutes>
    </StateWrapper>
  );
};

export const SwapPage: FC = () => (
  <SwapOrSendPage>
    <Route path="/" element={<SwapSend initialAction={SwapTabAction.SWAP} />} />
    <Route path={NOT_FOUND_ROUTE_NAME} element={<PageNotFoundPage />} />
    <Route path=":fromTo" element={<SwapSend initialAction={SwapTabAction.SWAP} />} />
  </SwapOrSendPage>
);

export const SendPage: FC = () => (
  <SwapOrSendPage>
    <Route path="/" element={<SwapSend initialAction={SwapTabAction.SEND} />} />
    <Route path={NOT_FOUND_ROUTE_NAME} element={<PageNotFoundPage />} />
    <Route path=":fromTo" element={<SwapSend initialAction={SwapTabAction.SEND} />} />
  </SwapOrSendPage>
);
