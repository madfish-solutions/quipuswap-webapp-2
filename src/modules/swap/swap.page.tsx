import { FC } from 'react';

import { Route, Routes } from 'react-router-dom';

import { SwapTabAction } from '@shared/types';

import { SwapSend } from './swap-send';

export const Swap: FC = () => {
  return (
    <Routes>
      <Route path={'swap'} element={<SwapSend initialAction={'swap' as SwapTabAction} />} />
      <Route path={'send'} element={<SwapSend initialAction={'send' as SwapTabAction} />} />
    </Routes>
  );
};
