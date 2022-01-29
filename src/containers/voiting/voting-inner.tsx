import { Fragment } from 'react';

import { StickyBlock } from '@quipuswap/ui-kit';
import { useTranslation } from 'next-i18next';

import { PageTitle } from '@components/common/page-title';
import s from '@styles/CommonContainer.module.sass';
import { getTokensOptionalPairName } from '@utils/helpers';

import { useTokensPair } from './helpers/voting.provider';
import { VotingDetails, VotingStats } from './structures';
import { WrappedVotingForm } from './structures/voting-form/wrapped-voting-form';

interface VotingProps {
  className?: string;
}

export const VotingInner: React.FC<VotingProps> = ({ className }) => {
  const { t } = useTranslation(['common']);
  const { tokenPair } = useTokensPair();

  const title = `${t('common|Voting')} ${getTokensOptionalPairName(tokenPair.token1, tokenPair.token2)}`;

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
