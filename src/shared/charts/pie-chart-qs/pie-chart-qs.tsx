import { FC, useContext } from 'react';

import cx from 'classnames';
import { Cell, Pie, PieChart } from 'recharts';

import { COLORS } from '@config/constants';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { formatValueBalance } from '@shared/helpers';

import { DefaultChart } from '../components/default-chart';
import { PieChartData } from '../types';
import styles from './pie-chart-qs.module.scss';
import { usePieCharViewModel } from './use-pie-chart-qs.vm';

export const PieChartQs: FC<PieChartData> = ({ data }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { pieChartExists } = usePieCharViewModel(data);

  return (
    <div
      className={cx(styles.chartWrapper, {
        [styles.dark]: colorThemeMode === ColorModes.Dark,
        [styles.light]: colorThemeMode === ColorModes.Light
      })}
    >
      {pieChartExists ? (
        <>
          <ul className={styles.ul}>
            {data.map(({ tokenValue, tokenSymbol }, index) => (
              <li key={index} className={styles.li}>
                <span className={styles.legend} style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className={styles.tokenAmount}>{formatValueBalance(tokenValue)}</span>
                <span className={styles.tokenSymbol}>{tokenSymbol}</span>
              </li>
            ))}
          </ul>
          <PieChart width={200} height={200}>
            <Pie
              data={data}
              innerRadius={80}
              outerRadius={100}
              dataKey="value"
              stroke="none"
              startAngle={-270}
              endAngle={90}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </>
      ) : (
        <DefaultChart />
      )}
    </div>
  );
};
