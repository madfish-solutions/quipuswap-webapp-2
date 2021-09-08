import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import For from '@icons/For.svg';
import NotFor from '@icons/NotFor.svg';

import { VoteProgress } from '@components/svg/VoteProgress';
import s from './DonutChart.module.sass';

type DonutChartProps = {
  votes: number
  vetos: number
  className?: string
};

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

const MIN = 0.1;
const MAX = 1;

export const DonutChart: React.FC<DonutChartProps> = ({
  votes,
  vetos,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  let value = votes / (votes + vetos);
  if (value < MIN) value = MIN;
  if (value > MAX) value = MAX;
  return (
    <div className={cx(s.container, themeClass[colorThemeMode])}>
      <div className={s.chart}>
        <VoteProgress progress={value < 0.1 ? 0.1 : value} />
        <div className={s.for}>
          <For />
          <div className={s.count}>
            {votes}
          </div>
          <div>
            QNTOT
          </div>
        </div>
        <div className={s.notfor}>
          <NotFor />
          <div className={s.count}>
            {vetos}
          </div>
          <div>
            QNTOT
          </div>
        </div>
        <div className={s.result}>
          <h2 className={s.h2}>
            {((votes / (vetos + votes)) * 100).toFixed(2)}
            %
          </h2>
          <div className={s.label}>Current Result</div>
        </div>

      </div>
    </div>
  );
};
