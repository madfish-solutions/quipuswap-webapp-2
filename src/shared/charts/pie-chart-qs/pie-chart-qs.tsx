import { FC, useContext } from 'react';

import cx from 'classnames';
import { Cell, Pie, PieChart } from 'recharts';

import { COLORS } from '@config/constants';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';

import styles from './pie-chart-qs.module.scss';

interface Props {
  data: Array<{ value: number; tokenSymbol: string }>;
}

export const PieChartQs: FC<Props> = ({ data }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div
      className={cx(styles.chartWrapper, {
        [styles.dark]: colorThemeMode === ColorModes.Dark,
        [styles.light]: colorThemeMode === ColorModes.Light
      })}
    >
      <PieChart width={200} height={200}>
        <Pie data={data} innerRadius={80} outerRadius={100} dataKey="value" stroke="none">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
      <ul>
        {data.map(({ value, tokenSymbol }, index) => (
          <li key={index} className={styles.li}>
            <span className={styles.legend} style={{ backgroundColor: COLORS[index % COLORS.length] }} />
            <span className={styles.tokenSymbol}>{tokenSymbol}</span>
            <span className={styles.tokenAmount}>{value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
