import React, { useContext } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { VoteProgress } from '@components/svg/VoteProgress';
import For from '@icons/For.svg';
import NotFor from '@icons/NotFor.svg';

import { STABLE_TOKEN } from '@utils/defaults';
import s from './DonutChart.module.sass';

type DonutChartProps = {
  votes: number
  vetos: number
  className?: string
  symbol?: string
};

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

const MIN = 0;
const MAX = 1;

export const DonutChart: React.FC<DonutChartProps> = ({
  votes,
  vetos,
  className,
  symbol = STABLE_TOKEN.metadata.symbol,
}) => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  let value = votes / (votes + vetos);
  if (value < MIN) value = MIN;
  if (value > MAX) value = MAX;
  return (
    <div className={cx(s.container, themeClass[colorThemeMode], className)}>
      <div className={s.chart}>
        <VoteProgress progress={value < 0 ? 0 : value} />
        <div className={s.for}>
          <For />
          <div className={s.count}>
            {votes}
          </div>
          <div>
            {symbol}
          </div>
        </div>
        <div className={s.notfor}>
          <NotFor />
          <div className={s.count}>
            {vetos}
          </div>
          <div>
            {symbol}
          </div>
        </div>
        <div className={s.result}>
          <h2 className={s.h2}>
            {((votes / (vetos + votes)) * 100).toFixed(2)}
            %
          </h2>
          <div className={s.label}>{t('common|Current Result')}</div>
        </div>

      </div>
    </div>
  );
};
