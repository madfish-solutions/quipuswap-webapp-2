import { SLASH } from '@config/constants';
import { TZKT_EXPLORER_URL } from '@config/environment';
import { toReal } from '@shared/helpers';

import {
  useLiquidityV3PoolStore,
  useLiquidityV3ItemTokens,
  useLiquidityV3PoolStats,
  useLiquidityV3ItemTokensSymbols
} from '../../../../hooks';
import { useV3AprAndVolume, useV3PoolCategories } from '../../hooks';

export const usePoolDetailsCreateViewModel = () => {
  const { contractAddress, contractBalance } = useLiquidityV3PoolStore();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();
  const { tokenXSymbol, tokenYSymbol } = useLiquidityV3ItemTokensSymbols();
  const { poolTvl, currentPrice, feeBpsPercentage } = useLiquidityV3PoolStats();

  const { tokenXBalance, tokenYBalance } = contractBalance;
  const tokenXAmount = toReal(tokenXBalance, tokenX);
  const tokenYAmount = toReal(tokenYBalance, tokenY);

  const categories = useV3PoolCategories();

  const { apr, volume } = useV3AprAndVolume();

  return {
    poolContractUrl: `${TZKT_EXPLORER_URL}${SLASH}${contractAddress}`,
    tvl: poolTvl,
    feeBps: feeBpsPercentage,
    currentPrice,
    tokenXSymbol,
    tokenXAmount,
    tokenYSymbol,
    tokenYAmount,
    categories,
    apr,
    volume
  };
};
