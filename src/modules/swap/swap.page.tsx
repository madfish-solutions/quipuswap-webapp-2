import { FC } from 'react';

import { Route, Routes } from 'react-router-dom';

import { SwapTabAction } from '@shared/types';

import { SwapSend } from './swap-send';

export const Swap: FC = () => {
  return (
    <Routes>
      <Route path=":fromTo" element={<SwapSend initialAction={'swap' as SwapTabAction} />} />
    </Routes>
  );
};

export const Send: FC = () => {
  return (
    <Routes>
      <Route path=":fromTo" element={<SwapSend initialAction={'send' as SwapTabAction} />} />
    </Routes>
  );
};
