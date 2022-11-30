import { useMemo } from 'react';

import BigNumber from 'bignumber.js';

import { IS_NETWORK_MAINNET } from '@config/config';
import { DOLLAR, PERCENT, TESTNET_EXCHANGE_RATE } from '@config/constants';
import { getSymbolsString, getTokenDecimals, isExist, toReal } from '@shared/helpers';
import { fractionToPercentage } from '@shared/helpers/percentage';
import { useTokenExchangeRate } from '@shared/hooks';
import { useTranslation } from '@translation';

import { calculateV3ItemTvl } from '../../../liquidity/helpers';
import { convertToAtomicPrice } from '../../../liquidity/pages/v3-item-page/helpers';
import { useLiquidityV3ItemStore } from '../store';
import { useLiquidityV3ItemTokens } from './use-liquidity-v3-item-tokens';

const TESTNET_EXCHANGE_RATE_BN = new BigNumber(TESTNET_EXCHANGE_RATE);
const FEE_BPS_PRECISION = 1e4;
export const CURRENT_PRICE_STAT_INDEX = 1;

export const useLiquidityV3PoolStats = () => {
  const { t } = useTranslation();
  const { contractBalance, feeBps, sqrtPrice } = useLiquidityV3ItemStore();
  const { getTokenExchangeRate } = useTokenExchangeRate();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();

  const { tokenXBalance, tokenYBalance } = contractBalance;

  const tokenXExchangeRate =
    IS_NETWORK_MAINNET && isExist(tokenX) ? getTokenExchangeRate(tokenX) : TESTNET_EXCHANGE_RATE_BN;
  const tokenYExchangeRate =
    IS_NETWORK_MAINNET && isExist(tokenY) ? getTokenExchangeRate(tokenY) : TESTNET_EXCHANGE_RATE_BN;

  const poolTvl = calculateV3ItemTvl(tokenXBalance, tokenYBalance, tokenXExchangeRate, tokenYExchangeRate);
  const currentPrice = isExist(sqrtPrice)
    ? toReal(convertToAtomicPrice(sqrtPrice), getTokenDecimals(tokenY) - getTokenDecimals(tokenX))
    : null;
  const feeBpsPercentage = isExist(feeBps) ? fractionToPercentage(feeBps.dividedBy(FEE_BPS_PRECISION)) : null;

  const tokensSymbols = getSymbolsString([tokenY, tokenX]);

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
        currency: tokensSymbols
      },
      {
        title: t('liquidity|feeRate'),
        amount: feeBpsPercentage,
        tooltip: t('liquidity|feeRateTooltip'),
        currency: PERCENT
      }
    ],
    [currentPrice, feeBpsPercentage, poolTvl, t, tokensSymbols]
  );

  return { stats };
};
