import { isNull } from '@shared/helpers';

import { PieChart } from '../types';

export const usePieCharViewModel = (data: Array<PieChart>) => {
  const pieChartExists = data.some(({ value }) => !isNull(value));

  return { pieChartExists };
};
