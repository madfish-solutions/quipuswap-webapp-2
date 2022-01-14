import React, { useContext } from 'react';

import { FoundDex, TransferParams, withdrawReward } from '@quipuswap/sdk';
import { Card, Button, Tooltip, ColorModes, VotingReward, ColorThemeContext } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { DashPlug } from '@components/ui/dash-plug';
import { useAccountPkh, useTezos } from '@utils/dapp';
import { FormatNumber } from '@utils/formatNumber';
import { Nullable } from '@utils/types';

import { isRewardGreaterThenZero } from './isRewardGreaterThenZero';
import s from './VotingStats.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

interface VotingStatsProps {
  className?: string;
  pendingReward?: string;
  balanceAmount: Nullable<string>;
  voteAmount: Nullable<BigNumber>;
  vetoAmount: Nullable<BigNumber>;
  dex?: FoundDex;
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

  return (
    <Card className={className} contentClassName={cx(s.content, modeClass[colorThemeMode])}>
      <div className={s.reward}>
        <div className={s.rewardContent}>
          <span className={s.rewardHeader}>{t('vote|Your Pending Rewards')}:</span>
          <span className={s.rewardAmount}>
            {FormatNumber(pendingReward)}
            <span className={s.rewardCurrency}>TEZ</span>
          </span>
        </div>
        <VotingReward />
      </div>

      <div className={s.item}>
        <span className={s.header}>
          {t('vote|Your LP')}
          :
          <Tooltip content={t('vote|Total number of LP tokens you own.')} />
        </span>
        <span className={s.amount}>{balanceAmount ? FormatNumber(balanceAmount) : <DashPlug />}</span>
      </div>

      <div className={s.item}>
        <span className={s.header}>
          {t('vote|Your votes')}
          :
          <Tooltip
            content={t('vote|The amount of votes cast. You have to lock your LP tokens to cast a vote for a baker.')}
          />
        </span>
        <span className={s.amount}>{voteAmount ? FormatNumber(voteAmount.toFixed()) : <DashPlug />}</span>
      </div>

      <div className={s.item}>
        <span className={s.header}>
          {t('vote|Your vetos')}
          :
          <Tooltip
            content={t(
              'vote|The amount of shares cast to veto a baker. You have to lock your LP tokens to veto a baker.'
            )}
          />
        </span>
        <span className={s.amount}>{vetoAmount ? FormatNumber(vetoAmount.toFixed()) : <DashPlug />}</span>
      </div>

      <Button
        disabled={!tezos || !accountPkh || !dex || !isRewardGreaterThenZero(pendingReward)}
        onClick={() => {
          const asyncFunc = async () => {
            if (!tezos || !dex || !accountPkh) {
              return;
            }
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
