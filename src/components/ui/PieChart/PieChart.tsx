import React, { useContext, useState } from 'react';
import { PieChart as PieChartLib } from 'react-minimal-pie-chart';
import cx from 'classnames';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

import s from './PieChart.module.sass';

type ChartData = {
  value: number,
  color: string,
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
};

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

const getDataTotalValue = (data:ChartData[]) => data.reduce((acc, cur) => cur.value + acc, 0);

export const PieChart: React.FC<PieChartProps> = ({
  data,
  label,
  legend,
  legendMarks,
  legendPlacement = 'left',
  showTotal = false,
  alignCenter = false,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const [hovered, setHovered] = useState<number | undefined>(undefined);
  const total = getDataTotalValue(data);

  const composeLegendClass = cx(
    s.legend,
    { [s.left]: legendPlacement === 'left' },
    { [s.right]: legendPlacement === 'right' },
  );

  const compoundClassName = cx(
    s.container,
    themeClass[colorThemeMode],
    { [s.center]: alignCenter },
  );

  return (
    <div className={compoundClassName}>
      {legend && (
      <div className={composeLegendClass}>
        {label && (<h5 className={s.legendLabel}>{label}</h5>)}
        {data.map((x) => (
          <div className={s.legendRow} key={x.label}>
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
      <div className={s.chart}>
        <PieChartLib
          data={data}
          lineWidth={20}
          viewBoxSize={[100, 100]}
          className={s.pieChart}
          // @ts-ignore
          onMouseOver={(_, index:any) => setHovered(index)}
          onMouseOut={() => {
            setHovered(undefined);
          }}
        />
        {showTotal && (
        <div className={s.total}>
          <h1 className={s.bold}>
            {hovered ? data[hovered].value : total}
          </h1>
        </div>
        )}

      </div>
    </div>
  );
};
