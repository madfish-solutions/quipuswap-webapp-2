import { Fragment } from 'react';

import { StickyBlock } from '@quipuswap/ui-kit';
import { useTranslation } from 'next-i18next';

import { PageTitle } from '@components/common/page-title';
import s from '@styles/CommonContainer.module.sass';
import { getTokensOptionalPairName } from '@utils/helpers';

import { useVotingTokens } from './helpers/voting.provider';
import { VotingDetails, VotingStats, WrappedVotingForm } from './structures';

interface VotingProps {
  className?: string;
}

export const VotingInner: React.FC<VotingProps> = ({ className }) => {
  const { t } = useTranslation(['common']);
  const { token1, token2 } = useVotingTokens();

  const title = `${t('common|Voting')} ${getTokensOptionalPairName(token1, token2)}`;

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
