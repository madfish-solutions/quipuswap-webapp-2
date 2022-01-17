import React, { useContext } from 'react';

import { FoundDex, TransferParams, withdrawReward } from '@quipuswap/sdk';
import { Card, Button, ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

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
  pendingReward: Nullable<string>;
  balanceAmount: Nullable<string>;
  voteAmount: Nullable<BigNumber>;
  vetoAmount: Nullable<BigNumber>;
  dex: Nullable<FoundDex>;
  handleSubmit: (params: TransferParams[]) => void;
}

export const VotingStats: React.FC<VotingStatsProps> = ({
  className,
  pendingReward = '0',
  balanceAmount,
  voteAmount,
  vetoAmount,
  dex,
  handleSubmit
}) => {
  const { t } = useTranslation(['vote']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  const handleWithdrawReward = async () => {
    if (!tezos || !dex || !accountPkh) {
      return;
    }
    const params = await withdrawReward(tezos, dex, accountPkh);
    handleSubmit(params);
  };

  return (
    <Card className={className} contentClassName={cx(s.content, modeClass[colorThemeMode])}>
      <RewardItem description={t('vote|Your Pending Rewards')} amount={pendingReward} currency="TEZ" />

      <VotingStatsItem
        value={balanceAmount}
        itemName={t('vote|Your LP')}
        tooltip={t('vote|Total number of LP tokens you own.')}
      />

      <VotingStatsItem
        value={voteAmount?.toFixed() ?? null}
        itemName={t('vote|Your votes')}
        tooltip={t('vote|The amount of votes cast. You have to lock your LP tokens to cast a vote for a baker.')}
      />

      <VotingStatsItem
        value={vetoAmount?.toFixed() ?? null}
        itemName={t('vote|Your vetos')}
        tooltip={t('vote|The amount of shares cast to veto a baker. You have to lock your LP tokens to veto a baker.')}
      />

      <Button
        disabled={!tezos || !accountPkh || !dex || !isRewardGreaterThenZero(pendingReward)}
        onClick={handleWithdrawReward}
        className={s.button}
      >
        {t('vote|Claim Reward')}
      </Button>
    </Card>
  );
};
