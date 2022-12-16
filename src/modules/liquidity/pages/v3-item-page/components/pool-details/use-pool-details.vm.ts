import { EMPTY_STRING, FEE_BASE_POINTS_PRECISION, SLASH } from '@config/constants';
import { TZKT_EXPLORER_URL } from '@config/environment';
import { calculateV3ItemTvl, getCurrentPrice, getSymbolsStringByActiveToken } from '@modules/liquidity/helpers';
import {
  useLiquidityV3CurrentPrice,
  useLiquidityV3ItemTokens,
  useLiquidityV3PoolStore
} from '@modules/liquidity/hooks';
import { isExist, toReal } from '@shared/helpers';
import { fractionToPercentage } from '@shared/helpers/percentage';

import { useLiquidityV3ItemTokensExchangeRates } from '../../hooks';

export const usePoolDetailsViewModel = () => {
  const store = useLiquidityV3PoolStore();
  const { contractAddress, contractBalance, feeBps } = store;
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();
  const { tokenXExchangeRate, tokenYExchangeRate } = useLiquidityV3ItemTokensExchangeRates();
  const currentPrice = useLiquidityV3CurrentPrice();

  const { tokenXBalance, tokenYBalance } = contractBalance;
  const tokenXAmount = toReal(tokenXBalance, tokenX);
  const tokenYAmount = toReal(tokenYBalance, tokenY);

  const poolTvl = calculateV3ItemTvl(tokenXAmount, tokenYAmount, tokenXExchangeRate, tokenYExchangeRate);

  const feeBpsPercentage = isExist(feeBps) ? fractionToPercentage(feeBps.dividedBy(FEE_BASE_POINTS_PRECISION)) : null;
  const _currentPrice = isExist(currentPrice) ? getCurrentPrice(currentPrice, store.activeTokenIndex) : null;

  const tokensSymbols = getSymbolsStringByActiveToken([tokenX, tokenY], store.activeTokenIndex);

  const handleButtonClick = (index: number) => store.setActiveTokenIndex(index);

  return {
    poolContractUrl: `${TZKT_EXPLORER_URL}${SLASH}${contractAddress}`,
    tvl: poolTvl,
    feeBps: feeBpsPercentage,
    currentPrice: _currentPrice,
    tokensSymbols,
    tokenXSymbol: tokenX?.metadata.symbol ?? EMPTY_STRING,
    tokenXAmount,
    tokenYSymbol: tokenY?.metadata.symbol ?? EMPTY_STRING,
    tokenYAmount,
    tokenActiveIndex: store.activeTokenIndex,
    handleButtonClick
  };
};
