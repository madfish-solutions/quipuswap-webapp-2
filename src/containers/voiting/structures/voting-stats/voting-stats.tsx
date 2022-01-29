import React, { useContext } from 'react';

import { FoundDex } from '@quipuswap/sdk';
import { Card, ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { Button } from '@components/ui/elements/button';
import { useClaimRewards } from '@containers/voiting/helpers';
import { useRewards, useVoter } from '@containers/voiting/helpers/voting.provider';
import { useAccountPkh, useTezos } from '@utils/dapp';
import { Nullable } from '@utils/types';

import { VotingStatsItem, RewardItem } from '../../components';
import { isRewardGreaterThenZero } from '../../helpers/is-reward-greater-yhen-zero';
import s from './voting-stats.module.scss';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

interface VotingStatsProps {
  className?: string;
  balanceAmount: Nullable<string>;
  dex: Nullable<FoundDex>;
}

export const VotingStats: React.FC<VotingStatsProps> = ({ className, balanceAmount, dex }) => {
  const { t } = useTranslation(['vote']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const { rewards } = useRewards();
  const { vote, veto } = useVoter();

  const handleWithdrawReward = useClaimRewards();
  const voteAmount = vote?.toFixed() ?? null;
  const vetoAmount = veto?.toFixed() ?? null;

  return (
    <Card className={className} contentClassName={cx(s.content, modeClass[colorThemeMode])}>
      <RewardItem description={t('vote|Your Pending Rewards')} amount={rewards} currency="TEZ" />

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

        <Button
          disabled={!tezos || !accountPkh || !dex || !isRewardGreaterThenZero(rewards)}
          onClick={async () => handleWithdrawReward(dex)}
          className={s.button}
        >
          {t('vote|Claim Reward')}
        </Button>
      </div>
    </Card>
  );
};
