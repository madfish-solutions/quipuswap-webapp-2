import { FC } from 'react';

import { VotingProvider } from './helpers/voting.provider';
import { VotingInner } from './voting';

interface VotingProps {
  className?: string;
}

export const Voting: FC<VotingProps> = ({ className }) => {
  return (
    <VotingProvider>
      <VotingInner className={className} />
    </VotingProvider>
  );
};
