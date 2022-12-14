import { useMemo } from 'react';

import { DOLLAR, PERCENT, FEE_BASE_POINTS_PRECISION } from '@config/constants';
import { isExist, toReal } from '@shared/helpers';
import { fractionToPercentage } from '@shared/helpers/percentage';
import { useTranslation } from '@translation';

import { calculateV3ItemTvl, getCurrentPrice, getSymbolsStringByActiveToken } from '../../../liquidity/helpers';
import { useLiquidityV3ItemTokensExchangeRates } from '../../../liquidity/pages/v3-item-page/hooks';
import { useLiquidityV3ItemStore } from '../store';
import { useLiquidityV3CurrentPrice } from './use-liquidity-v3-current-price';
import { useLiquidityV3ItemTokens } from './use-liquidity-v3-item-tokens';

export const useLiquidityV3PoolStats = () => {
  const { t } = useTranslation();
  const store = useLiquidityV3ItemStore();
  const { contractBalance, feeBps } = useLiquidityV3ItemStore();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();
  const currentPrice = useLiquidityV3CurrentPrice();
  const { tokenXExchangeRate, tokenYExchangeRate, isExchangeRatesError } = useLiquidityV3ItemTokensExchangeRates();

  const { tokenXBalance, tokenYBalance } = contractBalance;

  const poolTvl = calculateV3ItemTvl(
    toReal(tokenXBalance, tokenX),
    toReal(tokenYBalance, tokenY),
    tokenXExchangeRate,
    tokenYExchangeRate
  );
  const _currentPrice = isExist(currentPrice) ? getCurrentPrice(currentPrice, store.activeTokenIndex) : null;
  const feeBpsPercentage = isExist(feeBps) ? fractionToPercentage(feeBps.dividedBy(FEE_BASE_POINTS_PRECISION)) : null;

  const tokensSymbols = getSymbolsStringByActiveToken([tokenX, tokenY], store.activeTokenIndex);

  const stats = useMemo(
    () => [
      {
        title: t('liquidity|tvl'),
        amount: poolTvl,
        tooltip: t('liquidity|tvlTooltip'),
        currency: DOLLAR,
        isError: isExchangeRatesError
      },
      {
        title: t('liquidity|currentPrice'),
        amount: _currentPrice,
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
    [t, poolTvl, _currentPrice, tokensSymbols, feeBpsPercentage, isExchangeRatesError]
  );

  return { stats };
};
