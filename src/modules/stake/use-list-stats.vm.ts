import { BigNumber } from 'bignumber.js';

import { useTranslation } from '@translation';

export const useListStatsViewModel = () => {
  const { t } = useTranslation();

  const stats = [
    {
      title: t('stake|tvl'),
      tooltip: t('stake|tvlTooltip'),
      amount: new BigNumber(10),
      testId: 'statsTVL'
    },
    {
      title: t('stake|maxApr'),
      tooltip: t('stake|maxAprTooltip'),
      amount: new BigNumber(20),
      testId: 'statsMaxAPR'
    },
    {
      title: t('stake|pools'),
      tooltip: t('stake|poolsTooltip'),
      amount: new BigNumber(30),
      testId: 'statsPools'
    }
  ];

  return {
    stats
  };
};
