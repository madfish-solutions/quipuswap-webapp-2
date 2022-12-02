import { useMemo } from 'react';

import BigNumber from 'bignumber.js';

import { IS_NETWORK_MAINNET } from '@config/config';
import { DOLLAR, PERCENT, TESTNET_EXCHANGE_RATE } from '@config/constants';
import { getSymbolsString, isExist } from '@shared/helpers';
import { fractionToPercentage } from '@shared/helpers/percentage';
import { useTokenExchangeRate } from '@shared/hooks';
import { useTranslation } from '@translation';

import { calculateV3ItemTvl } from '../../../liquidity/helpers';
import { useLiquidityV3ItemStore } from '../store';
import { useLiquidityV3CurrentPrice } from './use-liquidity-v3-current-price';
import { useLiquidityV3ItemTokens } from './use-liquidity-v3-item-tokens';

const TESTNET_EXCHANGE_RATE_BN = new BigNumber(TESTNET_EXCHANGE_RATE);
const FEE_BPS_PRECISION = 1e4;

export const useLiquidityV3PoolStats = () => {
  const { t } = useTranslation();
  const { contractBalance, feeBps } = useLiquidityV3ItemStore();
  const { getTokenExchangeRate } = useTokenExchangeRate();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();
  const currentPrice = useLiquidityV3CurrentPrice();

  const { tokenXBalance, tokenYBalance } = contractBalance;

  const tokenXExchangeRate =
    IS_NETWORK_MAINNET && isExist(tokenX) ? getTokenExchangeRate(tokenX) : TESTNET_EXCHANGE_RATE_BN;
  const tokenYExchangeRate =
    IS_NETWORK_MAINNET && isExist(tokenY) ? getTokenExchangeRate(tokenY) : TESTNET_EXCHANGE_RATE_BN;

  const poolTvl = calculateV3ItemTvl(tokenXBalance, tokenYBalance, tokenXExchangeRate, tokenYExchangeRate);
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
