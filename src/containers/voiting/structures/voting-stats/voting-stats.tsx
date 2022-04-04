import React, { useContext } from 'react';

import { Card, ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { Button } from '@components/ui/elements/button';
import {
  useRewards,
  useTokensPair,
  useVoter,
  useVotingDex,
  useVotingLoading
} from '@containers/voiting/helpers/voting.provider';
import { useClaimRewards } from '@containers/voiting/hooks';
import { useAccountPkh, useTezos } from '@utils/dapp';
import { isNull } from '@utils/helpers';

import { VotingStatsItem, VotingRewardItem } from '../../components';
import { isRewardGreaterThenZero } from '../../helpers/is-reward-greater-yhen-zero';
import s from './voting-stats.module.scss';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

interface VotingStatsProps {
  className?: string;
}

export const VotingStats: React.FC<VotingStatsProps> = ({ className }) => {
  const { t } = useTranslation(['vote']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const { rewards } = useRewards();
  const { vote, veto } = useVoter();
  const { dex } = useVotingDex();
  const { tokenPair } = useTokensPair();
  const { isVotingLoading } = useVotingLoading();

  const balanceAmount = isVotingLoading ? null : tokenPair?.balance ?? null;

  const voteAmount = isVotingLoading || isNull(vote) ? null : vote.toFixed();
  const vetoAmount = isVotingLoading || isNull(veto) ? null : veto.toFixed();

  const rewardAmount = isVotingLoading ? null : rewards;

  const isButtonDisabled = isVotingLoading || !tezos || !accountPkh || !dex || !isRewardGreaterThenZero(rewards);

  const handleWithdrawReward = useClaimRewards();
  const handleClick = async () => handleWithdrawReward(dex);

  return (
    <Card className={className} contentClassName={cx(s.content, modeClass[colorThemeMode])}>
      <VotingRewardItem description={t('vote|Your Claimable Rewards')} amount={rewardAmount} currency="TEZ" />

      <div className={s.right}>
        <div className={s.votingsStatsItemContainer}>
          <VotingStatsItem
            value={balanceAmount}
            itemName={t('vote|Your LP')}
            tooltip={t('vote|Total number of LP tokens you own.')}
          />

          <VotingStatsItem
            value={voteAmount}
            itemName={t('vote|Your votes')}
            tooltip={t('vote|The amount of votes cast. You have to lock your LP tokens to cast a vote for a baker.')}
          />

          <VotingStatsItem
            value={vetoAmount}
            itemName={t('vote|Your vetos')}
            tooltip={t(
              'vote|The amount of shares cast to veto a baker. You have to lock your LP tokens to veto a baker.'
            )}
          />
        </div>

        <Button disabled={isButtonDisabled} onClick={handleClick} className={s.button}>
          {t('vote|Claim Reward')}
        </Button>
      </div>
    </Card>
  );
};
