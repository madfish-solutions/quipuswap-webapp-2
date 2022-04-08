import { FC } from 'react';

import { Routes, Route } from 'react-router-dom';

import { TestnetAlert } from '@shared/components';

import { VotingProvider } from './helpers/voting.provider';
import { VotingInner } from './voting-inner';

interface VotingProps {
  className?: string;
}

export const Voting: FC<VotingProps> = ({ className }) => {
  return (
    <VotingProvider>
      <TestnetAlert />
      <Routes>
        <Route path="/" element={<VotingInner className={className} />} />
        <Route path=":method/:fromTo" element={<VotingInner className={className} />} />
        {/* <Route path="/" element={<VotingInner className={className} />} />
        <Route path=":fromTo" element={<VotingInner className={className} />} /> */}
      </Routes>
    </VotingProvider>
  );
};
