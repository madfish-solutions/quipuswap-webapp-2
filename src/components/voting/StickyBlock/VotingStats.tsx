import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import VotingReward from '@icons/VotingReward.svg';
import VotingBorder from '@icons/VotingBorder.svg';

import s from './VotingStats.module.sass';

const content = [
  {
    id: 0,
    header: 'Your LP',
    amount: '1,000,000.00',
  },
  {
    id: 1,
    header: 'Your votes',
    amount: '777.77',
  },
  {
    id: 2,
    header: 'Your vetos',
    amount: '3.00',
  },
];

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

type VotingStatsProps = {
  className?: string
};

export const VotingStats: React.FC<VotingStatsProps> = ({
  className,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <Card className={className} contentClassName={cx(s.content, modeClass[colorThemeMode])}>
      <div className={s.reward}>
        <VotingBorder className={s.rewardBorder} />
        <div className={s.rewardContent}>
          <span className={s.rewardHeader}>Your Pending Rewards:</span>
          <span className={s.rewardAmount}>
            100,000,000
            <span className={s.rewardCurrency}>TEZ</span>
          </span>
        </div>
        <VotingReward />
      </div>
      {content.map(({ id, header, amount }) => (
        <div key={id} className={s.item}>
          <span className={s.header}>
            {header}
            :
          </span>
          <span className={s.amount}>{amount}</span>
        </div>
      ))}
      <Button className={s.button}>Claim Reward</Button>
    </Card>
  );
};
