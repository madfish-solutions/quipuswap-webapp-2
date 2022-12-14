import { EMPTY_STRING, FEE_BASE_POINTS_PRECISION, SLASH } from '@config/constants';
import { TZKT_EXPLORER_URL } from '@config/environment';
import { isExist } from '@shared/helpers';
import { fractionToPercentage } from '@shared/helpers/percentage';
import { useTokenExchangeRate } from '@shared/hooks';

import { calculateV3ItemTvl, getCurrentPrice, getSymbolsStringByActiveToken } from '../../../../helpers';
import { useLiquidityV3CurrentPrice, useLiquidityV3PoolStore, useLiquidityV3ItemTokens } from '../../../../hooks';

export const usePositionDetailsViewModel = () => {
  const store = useLiquidityV3PoolStore();
  const { contractAddress, contractBalance, feeBps } = useLiquidityV3PoolStore();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();
  const { getTokenExchangeRate } = useTokenExchangeRate();
  const currentPrice = useLiquidityV3CurrentPrice();

  const { tokenXBalance, tokenYBalance } = contractBalance;

  const tokenXExchangeRate = getTokenExchangeRate(tokenX);
  const tokenYExchangeRate = getTokenExchangeRate(tokenY);

  const poolTvl = calculateV3ItemTvl(tokenXBalance, tokenYBalance, tokenXExchangeRate, tokenYExchangeRate);

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
    tokenXAmount: tokenXBalance,
    tokenYSymbol: tokenY?.metadata.symbol ?? EMPTY_STRING,
    tokenYAmount: tokenYBalance,
    tokenActiveIndex: store.activeTokenIndex,
    handleButtonClick
  };
};