import { FEE_BASE_POINTS_PRECISION } from '@config/constants';
import { calculateV3ItemTvl, getCurrentPrice, getSymbolsStringByActiveToken } from '@modules/liquidity/helpers';
import { useLiquidityV3ItemTokensExchangeRates } from '@modules/liquidity/pages/v3-item-page/hooks';
import { isExist, toReal } from '@shared/helpers';
import { fractionToPercentage } from '@shared/helpers/percentage';

import { useLiquidityV3PoolStore } from '../store';
import { useLiquidityV3CurrentPrice } from './use-liquidity-v3-current-price';
import { useLiquidityV3ItemTokens } from './use-liquidity-v3-item-tokens';

export const useLiquidityV3PoolStats = () => {
  const store = useLiquidityV3PoolStore();
  const { contractBalance, feeBps } = store;
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
  const activeTokenCurrentPrice = isExist(currentPrice) ? getCurrentPrice(currentPrice, store.activeTokenIndex) : null;
  const feeBpsPercentage = isExist(feeBps) ? fractionToPercentage(feeBps.dividedBy(FEE_BASE_POINTS_PRECISION)) : null;

  const tokensSymbols = getSymbolsStringByActiveToken([tokenY, tokenX], store.activeTokenIndex);

  return {
    isExchangeRatesError,
    poolTvl,
    currentPrice: activeTokenCurrentPrice,
    feeBpsPercentage,
    tokensSymbols
  };
};
