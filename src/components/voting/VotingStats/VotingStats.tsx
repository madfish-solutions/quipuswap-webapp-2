import React, { useContext } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Tooltip } from '@components/ui/Tooltip';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import VotingReward from '@icons/VotingReward.svg';

import { FoundDex, TransferParams, withdrawReward } from '@quipuswap/sdk';
import { useAccountPkh, useTezos } from '@utils/dapp';
import s from './VotingStats.module.sass';

const content = [
  {
    id: 0,
    header: 'Your LP',
    amount: '0',
    tooltip: 'vote:Total number of LP tokens you own.',
  },
  {
    id: 1,
    header: 'Your votes',
    amount: '0',
    tooltip: 'The amount of votes cast. You have to lock your LP tokens to cast a vote for a baker.',
  },
  {
    id: 2,
    header: 'Your vetos',
    amount: '0',
    tooltip: 'The amount of shares cast to veto a baker. You have to lock your LP tokens to veto a baker.',
  },
];

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

type VotingStatsProps = {
  className?: string
  pendingReward?: string
  amounts?: string[],
  dex?:FoundDex
  handleSubmit: (params: TransferParams[]) => void
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

  return (
    <Card className={className} contentClassName={cx(s.content, modeClass[colorThemeMode])}>
      <div className={s.reward}>
        <div className={s.rewardContent}>
          <span className={s.rewardHeader}>
            Your Pending Rewards:
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
            {header}
            :

            <Tooltip content={t(tooltip)} />
          </span>
          <span className={s.amount}>{amounts[id] ? amounts[id] : amount}</span>
        </div>
      ))}
      <Button
        disabled={!tezos || !accountPkh || !dex}
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
        Claim Reward

      </Button>
    </Card>
  );
};
