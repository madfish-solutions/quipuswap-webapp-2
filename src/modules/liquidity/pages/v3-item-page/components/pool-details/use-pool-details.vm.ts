import { EMPTY_STRING, SLASH } from '@config/constants';
import { TZKT_EXPLORER_URL } from '@config/environment';
import { useLiquidityV3ItemTokens, useLiquidityV3PoolStats, useLiquidityV3PoolStore } from '@modules/liquidity/hooks';
import { toReal } from '@shared/helpers';

export const usePoolDetailsViewModel = () => {
  const store = useLiquidityV3PoolStore();
  const { contractAddress, contractBalance } = store;
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();
  const { poolTvl, currentPrice, tokensSymbols, feeBpsPercentage } = useLiquidityV3PoolStats();

  const { tokenXBalance, tokenYBalance } = contractBalance;
  const tokenXAmount = toReal(tokenXBalance, tokenX);
  const tokenYAmount = toReal(tokenYBalance, tokenY);

  const handleButtonClick = (index: number) => store.setActiveTokenIndex(index);

  return {
    poolContractUrl: `${TZKT_EXPLORER_URL}${SLASH}${contractAddress}`,
    tvl: poolTvl,
    feeBps: feeBpsPercentage,
    currentPrice,
    tokensSymbols,
    tokenXSymbol: tokenX?.metadata.symbol ?? EMPTY_STRING,
    tokenXAmount,
    tokenYSymbol: tokenY?.metadata.symbol ?? EMPTY_STRING,
    tokenYAmount,
    tokenActiveIndex: store.activeTokenIndex,
    handleButtonClick
  };
};
