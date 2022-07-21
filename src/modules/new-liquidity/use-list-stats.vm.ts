import { BigNumber } from 'bignumber.js';

import { useTranslation } from '@translation';

export const useListStatsViewModel = () => {
  const { t } = useTranslation();

  const stats = [
    {
      title: t('newLiquidity|tvl'),
      tooltip: t('newLiquidity|tvlTooltip'),
      amount: new BigNumber(10),
      testId: 'statsTVL'
    },
    {
      title: t('newLiquidity|maxApr'),
      tooltip: t('newLiquidity|maxAprTooltip'),
      amount: new BigNumber(20),
      testId: 'statsMaxAPR'
    },
    {
      title: t('newLiquidity|pools'),
      tooltip: t('newLiquidity|poolsTooltip'),
      amount: new BigNumber(30),
      testId: 'statsPools'
    }
  ];

  return {
    stats
  };
};
