import React, { useContext, useState } from 'react';
import { PieChart as PieChartLib } from 'react-minimal-pie-chart';
import cx from 'classnames';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

import s from './PieChart.module.sass';

type ChartData = {
  value: number,
  color: string,
  opacity?: number,
  label?: string
};

type PieChartProps = {
  data: ChartData[]
  label?: string
  legend: boolean
  legendPlacement?: 'left' | 'right'
  legendMarks?: boolean
  showTotal?: boolean
  alignCenter?: boolean
  className?: string
  chartClassName?: string
  legendClassName?: string
};

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

const getDataTotalValue = (data:ChartData[]) => data.reduce((acc, cur) => cur.value + acc, 0);

export const PieChart: React.FC<PieChartProps> = ({
  data: dataWrapper,
  label,
  legend,
  legendMarks,
  legendPlacement = 'left',
  showTotal = false,
  alignCenter = false,
  className,
  chartClassName,
  legendClassName,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const [hovered, setHovered] = useState<number | undefined>(undefined);
  const total = getDataTotalValue(dataWrapper);

  const data = dataWrapper.map((entry, i) => {
    if (hovered !== undefined && hovered !== i) {
      return {
        ...entry,
        opacity: 0.5,
      };
    }
    return entry;
  });

  const composeLegendClass = cx(
    s.legend,
    { [s.left]: legendPlacement === 'left' },
    { [s.right]: legendPlacement === 'right' },
    legendClassName,
  );

  const compoundClassName = cx(
    s.container,
    themeClass[colorThemeMode],
    { [s.center]: alignCenter },
    className,
  );

  return (
    <div className={compoundClassName}>
      {legend && (
      <div className={composeLegendClass}>
        {label && (<h5 className={s.legendLabel}>{label}</h5>)}
        {data.map((x, idx) => (
          <div
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => {
              setHovered(undefined);
            }}
            className={s.legendRow}
            key={x.label}
          >
            <div className={s.legendColor} style={{ backgroundColor: x.color }} />
            <div className={s.legendText}>
              {x.label}
            </div>
            {legendMarks && (
            <div className={s.legendMark}>
              {((x.value / total) * 100).toFixed(2)}
              {' '}
              %
            </div>
            )}
          </div>
        ))}
      </div>
      )}
      <div className={cx(s.chart, chartClassName)}>
        <PieChartLib
          data={data}
          segmentsStyle={(index) => ({ transition: 'opacity .3s', opacity: data[index].opacity })}
          lineWidth={20}
          viewBoxSize={[100, 100]}
          className={s.pieChart}
        />
        {showTotal && (
        <div className={s.total}>
          <h1 className={s.bold}>
            {total}
          </h1>
        </div>
        )}

      </div>
    </div>
  );
};
