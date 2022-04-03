import { FC } from 'react';

import { Route, Routes } from 'react-router-dom';

import { Voting as VotingPage } from './voting';

export const Voting: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<VotingPage />} />
      <Route path=":method" element={<VotingPage />} />
    </Routes>
  );
};
