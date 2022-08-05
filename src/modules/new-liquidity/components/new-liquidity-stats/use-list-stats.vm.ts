import { BigNumber } from 'bignumber.js';

import { PERCENT } from '@config/constants';
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
      currency: PERCENT,
      testId: 'statsMaxAPR'
    },
    {
      title: t('newLiquidity|pools'),
      tooltip: t('newLiquidity|poolsTooltip'),
      amount: new BigNumber(30),
      currency: null,
      testId: 'statsPools'
    }
  ];

  return {
    stats,
    slidesToShow: 3
  };
};
