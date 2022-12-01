import { useMemo } from 'react';

import { IS_NETWORK_MAINNET } from '@config/config';
import { DOLLAR, PERCENT, FEE_BPS_PRECISION, TESTNET_EXCHANGE_RATE_BN } from '@config/constants';
import { isExist } from '@shared/helpers';
import { fractionToPercentage } from '@shared/helpers/percentage';
import { useTokenExchangeRate } from '@shared/hooks';
import { useTranslation } from '@translation';

import { calculateV3ItemTvl, getCurrentPrice, getSymbolsStringByActiveToken } from '../../../liquidity/helpers';
import { useLiquidityV3ItemStore } from '../store';
import { useLiquidityV3ItemTokens } from './use-liquidity-v3-item-tokens';

export const useLiquidityV3PoolStats = () => {
  const { t } = useTranslation();
  const store = useLiquidityV3ItemStore();
  const { contractBalance, feeBps, sqrtPrice } = useLiquidityV3ItemStore();
  const { getTokenExchangeRate } = useTokenExchangeRate();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();

  const { tokenXBalance, tokenYBalance } = contractBalance;

  const tokenXExchangeRate =
    IS_NETWORK_MAINNET && isExist(tokenX) ? getTokenExchangeRate(tokenX) : TESTNET_EXCHANGE_RATE_BN;
  const tokenYExchangeRate =
    IS_NETWORK_MAINNET && isExist(tokenY) ? getTokenExchangeRate(tokenY) : TESTNET_EXCHANGE_RATE_BN;

  const poolTvl = calculateV3ItemTvl(tokenXBalance, tokenYBalance, tokenXExchangeRate, tokenYExchangeRate);
  const currentPrice = isExist(sqrtPrice) ? getCurrentPrice(sqrtPrice, store.activeTokenId) : null;
  const feeBpsPercentage = isExist(feeBps) ? fractionToPercentage(feeBps.dividedBy(FEE_BPS_PRECISION)) : null;

  const symbolsString = getSymbolsStringByActiveToken([tokenX, tokenY], store.activeTokenId);

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
        currency: symbolsString
      },
      {
        title: t('liquidity|feeRate'),
        amount: feeBpsPercentage,
        tooltip: t('liquidity|feeRateTooltip'),
        currency: PERCENT
      }
    ],
    [currentPrice, feeBpsPercentage, poolTvl, symbolsString, t]
  );

  return { stats };
};
