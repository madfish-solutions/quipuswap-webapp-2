import { FC } from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { HomePage } from '@pages/home';

export const AppRouter: FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="hash" element={<HomePage />} />
    </Routes>
  </BrowserRouter>
);
