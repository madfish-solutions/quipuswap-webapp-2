import { useMemo } from 'react';

import BigNumber from 'bignumber.js';

import { IS_NETWORK_MAINNET } from '@config/config';
import { DOLLAR, PERCENT, PERCENT_100, TESTNET_EXCHANGE_RATE, ZERO_AMOUNT_BN } from '@config/constants';
import { isExist } from '@shared/helpers';
import { useTokenExchangeRate } from '@shared/hooks';
import { useTranslation } from '@translation';

import { calculateV3ItemTvl } from '../../../liquidity/helpers';
import { convertToRealPrice } from '../../../liquidity/pages/v3-item-page/helpers';
import { useLiquidityV3ItemStore } from '../store';
import { useLiquidityV3ItemTokens } from './use-liquidity-v3-item-tokens';

const TESTNET_EXCHANGE_RATE_BN = new BigNumber(TESTNET_EXCHANGE_RATE);
const FEE_BPS_PRECISION = 1e4;

export const useLiquidityV3PoolStats = () => {
  const { t } = useTranslation();
  const { contractBalance, feeBps, sqrtPrice } = useLiquidityV3ItemStore();
  const { getTokenExchangeRate } = useTokenExchangeRate();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();

  const tokenXBalance = contractBalance.token_x_balance;
  const tokenYBalance = contractBalance.token_y_balance;

  const tokenXExchangeRate =
    IS_NETWORK_MAINNET && isExist(tokenX) ? getTokenExchangeRate(tokenX) : TESTNET_EXCHANGE_RATE_BN;
  const tokenYExchangeRate =
    IS_NETWORK_MAINNET && isExist(tokenY) ? getTokenExchangeRate(tokenY) : TESTNET_EXCHANGE_RATE_BN;

  const poolTvl = calculateV3ItemTvl(tokenXBalance, tokenYBalance, tokenXExchangeRate, tokenYExchangeRate);
  const currentPrice = isExist(sqrtPrice) ? convertToRealPrice(sqrtPrice) : ZERO_AMOUNT_BN;
  const preparedFeeBps = feeBps?.dividedBy(FEE_BPS_PRECISION).multipliedBy(PERCENT_100);

  const stats = useMemo(
    () => [
      {
        title: t('liquidity|tvl'),
        amount: poolTvl,
        tooltip: t('liquidity|tvlTooltip'),
        currency: DOLLAR
      },
      {
        title: t('liquidity|currentPrice'),
        amount: currentPrice,
        tooltip: t('liquidity|currentPriceTooltip'),
        currency: PERCENT
      },
      {
        title: t('liquidity|feeRate'),
        amount: preparedFeeBps,
        tooltip: t('liquidity|feeRateTooltip'),
        currency: PERCENT
      }
    ],
    [currentPrice, poolTvl, preparedFeeBps, t]
  );

  return { stats };
};
