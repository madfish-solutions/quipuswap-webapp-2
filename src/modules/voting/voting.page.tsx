import { FC } from 'react';

import { Route } from 'react-router-dom';

import { SentryRoutes } from '@shared/services';

import { VotingProvider } from './helpers/voting.provider';
import { VotingInner } from './voting-inner';

interface VotingProps {
  className?: string;
}

export const VotingPage: FC<VotingProps> = ({ className }) => {
  return (
    <VotingProvider>
      <SentryRoutes>
        <Route path="/" element={<VotingInner className={className} />} />
        <Route path=":method/:fromTo" element={<VotingInner className={className} />} />
      </SentryRoutes>
    </VotingProvider>
  );
};
