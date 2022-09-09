import { FC } from 'react';

import { Route } from 'react-router-dom';

import { SentryRoutes } from '@shared/services';
import { SwapTabAction } from '@shared/types';

import { SwapSend } from './swap-send';

export const SwapPage: FC = () => {
  return (
    <SentryRoutes>
      <Route path="/" element={<SwapSend initialAction={'swap' as SwapTabAction} />} />
      <Route path=":fromTo" element={<SwapSend initialAction={'swap' as SwapTabAction} />} />
    </SentryRoutes>
  );
};

export const SendPage: FC = () => {
  return (
    <SentryRoutes>
      <Route path="/" element={<SwapSend initialAction={'send' as SwapTabAction} />} />
      <Route path=":fromTo" element={<SwapSend initialAction={'send' as SwapTabAction} />} />
    </SentryRoutes>
  );
};
