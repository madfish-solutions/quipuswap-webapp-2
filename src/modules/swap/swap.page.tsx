import { FC } from 'react';

import { Route, Routes } from 'react-router-dom';

import { SwapTabAction } from '@shared/types';

import { SwapSend } from './swap-send';

export const SwapPage: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<SwapSend initialAction={'swap' as SwapTabAction} />} />
      <Route path=":fromTo" element={<SwapSend initialAction={'swap' as SwapTabAction} />} />
    </Routes>
  );
};

export const SendPage: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<SwapSend initialAction={'send' as SwapTabAction} />} />
      <Route path=":fromTo" element={<SwapSend initialAction={'send' as SwapTabAction} />} />
    </Routes>
  );
};
