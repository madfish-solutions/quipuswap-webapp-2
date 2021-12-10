import React, { useContext, useMemo } from 'react';
import {
  Card,
  Button,
  Tooltip,
  ColorModes,
  VotingReward,
  ColorThemeContext,
} from '@quipuswap/ui-kit';
import { FoundDex, TransferParams, withdrawReward } from '@quipuswap/sdk';
import { useTranslation } from 'next-i18next';
import cx from 'classnames';

import { useAccountPkh, useTezos } from '@utils/dapp';

import { isRewardGreaterThenZero } from './isRewardGreaterThenZero';

import s from './VotingStats.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

type VotingStatsProps = {
  className?: string;
  pendingReward?: string;
  amounts?: string[];
  dex?: FoundDex;
  handleSubmit: (params: TransferParams[]) => void;
};

export const VotingStats: React.FC<VotingStatsProps> = ({
  className,
  pendingReward = '0',
  amounts = [],
  dex,
  handleSubmit,
}) => {
  const { t } = useTranslation(['vote']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  const content = useMemo(
    () => [
      {
        id: 0,
        header: 'vote|Your LP',
        amount: amounts[0] ?? '0',
        tooltip: 'vote|Total number of LP tokens you own.',
      },
      {
        id: 1,
        header: 'vote|Your votes',
        amount: amounts[1] ?? '0',
        tooltip:
          'vote|The amount of votes cast. You have to lock your LP tokens to cast a vote for a baker.',
      },
      {
        id: 2,
        header: 'vote|Your vetos',
        amount: amounts[2] ?? '0',
        tooltip:
          'vote|The amount of shares cast to veto a baker. You have to lock your LP tokens to veto a baker.',
      },
    ],
    [amounts],
  );

  return (
    <Card
      className={className}
      contentClassName={cx(s.content, modeClass[colorThemeMode])}
    >
      <div className={s.reward}>
        <div className={s.rewardContent}>
          <span className={s.rewardHeader}>
            {t('vote|Your Pending Rewards')}
            :
          </span>
          <span className={s.rewardAmount}>
            {pendingReward}
            <span className={s.rewardCurrency}>TEZ</span>
          </span>
        </div>
        <VotingReward />
      </div>
      {content.map(({
        id, header, amount, tooltip,
      }) => (
        <div key={id} className={s.item}>
          <span className={s.header}>
            {t(header)}
            :
            <Tooltip content={t(tooltip)} />
          </span>
          <span className={s.amount}>{amount}</span>
        </div>
      ))}
      <Button
        disabled={!tezos || !accountPkh || !dex || !isRewardGreaterThenZero(pendingReward)}
        onClick={() => {
          const asyncFunc = async () => {
            if (!tezos || !dex || !accountPkh) return;
            const params = await withdrawReward(tezos, dex, accountPkh);
            handleSubmit(params);
          };
          asyncFunc();
        }}
        className={s.button}
      >
        {t('vote|Claim Reward')}
      </Button>
    </Card>
  );
};
