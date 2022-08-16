import { FC } from 'react';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

import styles from './pie-chart-qs.module.scss';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface Props {
  data: Array<{ value: number }>;
}

export const PieChartQS: FC<Props> = ({ data }) => (
  <div className={styles.chartContainer}>
    <ResponsiveContainer>
      <PieChart>
        <Pie data={data} cx="40%" innerRadius={80} outerRadius={100} dataKey="value">
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} stroke="none" fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  </div>
);
