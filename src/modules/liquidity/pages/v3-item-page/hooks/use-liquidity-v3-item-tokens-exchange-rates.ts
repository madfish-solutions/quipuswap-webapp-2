import { useLiquidityV3CurrentPrice, useLiquidityV3ItemTokens } from '@modules/liquidity/hooks';
import { isExist } from '@shared/helpers';
import { useTokenExchangeRate } from '@shared/hooks';

export const useLiquidityV3ItemTokensExchangeRates = () => {
  const { getTokenExchangeRate } = useTokenExchangeRate();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();
  const currentPrice = useLiquidityV3CurrentPrice();

  const originalTokenXExchangeRate = getTokenExchangeRate(tokenX);
  const originalTokenYExchangeRate = getTokenExchangeRate(tokenY);
  const tokenXExchangeRate =
    originalTokenXExchangeRate ?? (currentPrice && originalTokenYExchangeRate?.multipliedBy(currentPrice));
  const tokenYExchangeRate =
    originalTokenYExchangeRate ?? (currentPrice && originalTokenXExchangeRate?.dividedBy(currentPrice));
  const isExchangeRatesError = (!isExist(tokenXExchangeRate) || !isExist(tokenYExchangeRate)) && isExist(currentPrice);

  return { tokenXExchangeRate, tokenYExchangeRate, isExchangeRatesError };
};
