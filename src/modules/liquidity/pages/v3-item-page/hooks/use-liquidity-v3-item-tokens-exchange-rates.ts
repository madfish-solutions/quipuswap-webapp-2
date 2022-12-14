import { useLiquidityV3ItemTokens } from '@modules/liquidity/hooks';
import { isExist } from '@shared/helpers';
import { useTokenExchangeRate } from '@shared/hooks';

export const useLiquidityV3ItemTokensExchangeRates = () => {
  const { getTokenExchangeRate } = useTokenExchangeRate();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();

  const originalTokenXExchangeRate = getTokenExchangeRate(tokenX);
  const originalTokenYExchangeRate = getTokenExchangeRate(tokenY);
  const tokenXExchangeRate = originalTokenXExchangeRate ?? originalTokenYExchangeRate;
  const tokenYExchangeRate = originalTokenYExchangeRate ?? originalTokenXExchangeRate;
  const isExchangeRatesError = !isExist(tokenXExchangeRate) || !isExist(tokenYExchangeRate);

  return { tokenXExchangeRate, tokenYExchangeRate, isExchangeRatesError };
};
