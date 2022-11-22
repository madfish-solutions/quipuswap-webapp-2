import { FC } from 'react';

import { VotingProvider } from './helpers/voting.provider';
import { VotingInner } from './voting-inner';

export const VotingPage: FC = () => (
  <VotingProvider>
    <VotingInner />
  </VotingProvider>
);
