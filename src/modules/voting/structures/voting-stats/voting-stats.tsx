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

import { isRewardGreaterThenZero } from '../../helpers/is-reward-greater-yhen-zero';
import s from './voting-stats.module.scss';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

interface VotingStatsProps {
  className?: string;
}

export const VotingStats: FC<VotingStatsProps> = ({ className }) => {
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
      <VotingRewardItem description={'vote|Your Claimable Rewards'} amount={rewardAmount} currency="TEZ" />

      <div className={s.right}>
        <div className={s.votingsStatsItemContainer}>
          <VotingStatsItem
            value={balanceAmount}
            itemName={'vote|Your LP'}
            tooltip={'vote|Total number of LP tokens you own.'}
          />

          <VotingStatsItem
            value={voteAmount}
            itemName={'vote|Your votes'}
            tooltip={'vote|The amount of votes cast. You have to lock your LP tokens to cast a vote for a baker.'}
          />

          <VotingStatsItem
            value={vetoAmount}
            itemName={'vote|Your vetos'}
            tooltip={'vote|The amount of shares cast to veto a baker. You have to lock your LP tokens to veto a baker.'}
          />
        </div>

        <Button disabled={isButtonDisabled} onClick={handleClick} className={s.button}>
          {'vote|Claim Reward'}
        </Button>
      </div>
    </Card>
  );
};
