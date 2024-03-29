import { FC, useContext } from 'react';

import cx from 'classnames';

import { VotingStatsItem, VotingRewardItem } from '@modules/voting/components';
import {
  useRewards,
  useTokensPair,
  useVoter,
  useVotingDex,
  useVotingLoading
} from '@modules/voting/helpers/voting.provider';
import { useClaimRewards } from '@modules/voting/hooks';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { useAccountPkh, useTezos } from '@providers/use-dapp';
import { Card } from '@shared/components';
import { Button } from '@shared/components/button';
import { isNull } from '@shared/helpers';
import { useTranslation } from '@translation';

import s from './voting-stats.module.scss';
import { isRewardGreaterThenZero } from '../../helpers/is-reward-greater-yhen-zero';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

interface VotingStatsProps {
  className?: string;
}

export const VotingStats: FC<VotingStatsProps> = ({ className }) => {
  const { t } = useTranslation();
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
    <Card className={className} contentClassName={cx(s.content, modeClass[colorThemeMode])} data-test-id="votingStats">
      <VotingRewardItem description={t('voting|Your Claimable Rewards')} amount={rewardAmount} currency="TEZ" />

      <div className={s.right}>
        <div className={s.votingsStatsItemContainer}>
          <VotingStatsItem
            value={balanceAmount}
            itemName={t('voting|Your LP')}
            tooltip={'voting|Total number of LP tokens you own.'}
            data-test-id="yourLP"
          />

          <VotingStatsItem
            value={voteAmount}
            itemName={t('voting|Your votes')}
            tooltip={t('voting|The amount of votes cast. You have to lock your LP tokens to cast a vote for a baker.')}
            data-test-id="yourVotes"
          />

          <VotingStatsItem
            value={vetoAmount}
            itemName={t('voting|Your vetos')}
            tooltip={t(
              'voting|The amount of shares cast to veto a baker. You have to lock your LP tokens to veto a baker.'
            )}
            data-test-id="yourVetos"
          />
        </div>

        <Button disabled={isButtonDisabled} onClick={handleClick} className={s.button} data-test-id="claimRewardButton">
          {t('voting|Claim Reward')}
        </Button>
      </div>
    </Card>
  );
};
