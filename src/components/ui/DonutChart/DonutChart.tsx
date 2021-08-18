// import * as d3 from 'd3';
import React from 'react';
import { PieChart } from 'react-minimal-pie-chart';
// import cx from 'classnames';
// import { createChart, IChartApi } from 'lightweight-charts';

// import { prettyPrice } from '@utils/helpers';
// import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
// import { usePrevious } from '@hooks/usePrevious';
// import { Card, CardContent, CardHeader } from '@components/ui/Card';
import For from '@icons/For.svg';
import NotFor from '@icons/NotFor.svg';

import s from './DonutChart.module.sass';

type DonutChartProps = {
  votes: number
  vetos: number
  className?: string
};

export const DonutChart: React.FC<DonutChartProps> = ({
  votes,
  vetos,
}) => (
  <div className={s.container}>
    <PieChart
      data={[{ value: votes, color: '#2ED33E' }, { value: vetos, color: '#EA2424' }]}
      lineWidth={15}
      rounded
      startAngle={180}
      lengthAngle={180}
      viewBoxSize={[100, 50]}
      className={s.pieChart}
    />
    <div className={s.for}>
      <For />
      <div>
        {votes}
      </div>
      <div>
        QNTOT
      </div>
    </div>
    <div className={s.notfor}>
      <NotFor />
      <div>
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
);
