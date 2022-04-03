import { Fragment } from 'react';

import { StickyBlock, PageTitle } from '@shared/components';
import { getTokensOptionalPairName } from '@shared/helpers';
import s from '@styles/CommonContainer.module.scss';

import { useVotingTokens } from './helpers/voting.provider';
import { VotingDetails, VotingStats, WrappedVotingForm } from './structures';

interface VotingProps {
  className?: string;
}

export const VotingInner: React.FC<VotingProps> = ({ className }) => {
  const { token1, token2 } = useVotingTokens();

  const title = `${'common|Voting'} ${getTokensOptionalPairName(token1, token2)}`;

  return (
    <Fragment>
      <PageTitle>{title}</PageTitle>

      <VotingStats className={s.votingStats} />

      <StickyBlock className={className}>
        <WrappedVotingForm />
        <VotingDetails />
      </StickyBlock>
    </Fragment>
  );
};
