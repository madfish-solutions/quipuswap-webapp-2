import { StickyBlock, PageTitle, TestnetAlert } from '@shared/components';
import { getTokensOptionalPairName } from '@shared/helpers';
import s from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import { useVotingTokens } from './helpers/voting.provider';
import { VotingDetails, VotingStats, WrappedVotingForm } from './structures';

interface VotingProps {
  className?: string;
}

export const VotingInner: React.FC<VotingProps> = ({ className }) => {
  const { t } = useTranslation();
  const { token1, token2 } = useVotingTokens();

  const title = `${t('common|Voting')} ${getTokensOptionalPairName(token1, token2)}`;

  return (
    <div data-test-id="votingPage">
      <TestnetAlert />

      <PageTitle>{title}</PageTitle>

      <VotingStats className={s.votingStats} />

      <StickyBlock className={className}>
        <WrappedVotingForm />
        <VotingDetails />
      </StickyBlock>
    </div>
  );
};
