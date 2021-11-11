import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';
import { VotingReward } from '@components/svg/VotingReward';

import s from './FarmingStats.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

type FarmingStatsProps = {
  className?: string
};

export const FarmingStats: React.FC<FarmingStatsProps> = ({
  className,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <Card className={className} contentClassName={cx(s.content, modeClass[colorThemeMode])}>
      <div className={s.flex}>
        <div className={s.reward}>
          <div className={s.rewardContent}>
            <span className={s.rewardHeader}>
              Your Pending QNOTs
            </span>
            <span className={s.rewardAmount}>
              100,000,000
            </span>
          </div>
          <VotingReward />
        </div>
        <div className={s.item}>
          <span className={s.header}>
            Your claimed QNOTs
          </span>
          <span className={s.amount}>1,000,000.00</span>
        </div>
      </div>
      <Button className={s.button}>Harvest All</Button>
    </Card>
  );
};
