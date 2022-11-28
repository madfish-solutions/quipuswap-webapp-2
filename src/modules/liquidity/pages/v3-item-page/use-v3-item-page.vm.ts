import { useEffect } from 'react';

import BigNumber from 'bignumber.js';

import { DOLLAR, PERCENT_100 } from '@config/constants';
import { useLiquidityV3ItemStore } from '@modules/liquidity/hooks';
import { useNewExchangeRates } from '@providers/use-new-exchange-rate';
import { useTranslation } from '@translation';

import { calculateV3ItemTvl } from '../../../liquidity/helpers';
import { useGetLiquidityV3Item } from '../../../liquidity/hooks/loaders/use-get-liquidity-v3-item';

const feeBpsPrecision = 1e4;

export const useV3ItemPageViewModel = () => {
  const { t } = useTranslation();
  const exchangeRates = useNewExchangeRates();
  const { itemSore, contractBalance } = useLiquidityV3ItemStore();
  const { getLiquidityV3Item } = useGetLiquidityV3Item();

  const tokenX = itemSore.rawData?.constants.token_x;
  const tokenY = itemSore.rawData?.constants.token_y;
  const tokenXBalance = contractBalance.token_x_balance;
  const tokenYBalance = contractBalance.token_y_balance;
  const feeBps = itemSore.rawData?.constants.fee_bps?.dividedBy(feeBpsPrecision).multipliedBy(PERCENT_100);
  const tvl = calculateV3ItemTvl(tokenX, tokenY, [tokenXBalance, tokenYBalance], exchangeRates);

  useEffect(() => {
    void getLiquidityV3Item();
  }, [getLiquidityV3Item]);

  const stats = [
    {
      title: t('liquidity|tvl'),
      amount: tvl,
      tooltip: '1',
      currency: DOLLAR
    },
    {
      title: t('liquidity|currentPrice'),
      amount: new BigNumber(1),
      tooltip: '1',
      currency: '%'
    },
    {
      title: t('liquidity|feeRate'),
      amount: feeBps,
      tooltip: '1',
      currency: '%'
    }
  ];

  return { stats };
};
