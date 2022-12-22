import { LIQUIDITY_V3_POOL_TAGS } from '@config/config';
import { SLASH } from '@config/constants';
import { NETWORK_ID, TZKT_EXPLORER_URL } from '@config/environment';
import { toReal } from '@shared/helpers';

import {
  useLiquidityV3PoolStore,
  useLiquidityV3ItemTokens,
  useLiquidityV3PoolStats,
  useLiquidityV3ItemTokensSymbols
} from '../../../../hooks';

export const usePoolDetailsCreateViewModel = () => {
  const store = useLiquidityV3PoolStore();
  const { contractAddress, contractBalance } = useLiquidityV3PoolStore();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();
  const { tokenXSymbol, tokenYSymbol } = useLiquidityV3ItemTokensSymbols();
  const { poolTvl, currentPrice, tokensSymbols, feeBpsPercentage } = useLiquidityV3PoolStats();

  const { tokenXBalance, tokenYBalance } = contractBalance;
  const tokenXAmount = toReal(tokenXBalance, tokenX);
  const tokenYAmount = toReal(tokenYBalance, tokenY);

  const handleButtonClick = (index: number) => store.setActiveTokenIndex(index);

  const categories = LIQUIDITY_V3_POOL_TAGS[NETWORK_ID][Number(store.poolId)];

  return {
    poolContractUrl: `${TZKT_EXPLORER_URL}${SLASH}${contractAddress}`,
    tvl: poolTvl,
    feeBps: feeBpsPercentage,
    currentPrice,
    tokensSymbols,
    tokenXSymbol,
    tokenXAmount,
    tokenYSymbol,
    tokenYAmount,
    tokenActiveIndex: store.activeTokenIndex,
    handleButtonClick,
    categories
  };
};
