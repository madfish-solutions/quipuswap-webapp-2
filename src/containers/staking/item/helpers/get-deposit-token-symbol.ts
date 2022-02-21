import { StakingItem } from '@interfaces/staking.interfaces';

import { normalizeTokenSymbol } from './normalize-token-symbol';

export const getDepositTokenSymbol = (stakeItem: StakingItem) => {
  const {
    tokenA: {
      metadata: { symbol: rawTokenASymbol }
    },
    tokenB
  } = stakeItem;
  const tokenASymbol = normalizeTokenSymbol(rawTokenASymbol);
  const rawTokenBSymbol = tokenB?.metadata.symbol;
  const tokenBSymbol = rawTokenBSymbol ? normalizeTokenSymbol(rawTokenBSymbol) : null;

  return tokenBSymbol ? `${tokenASymbol}/${tokenBSymbol}` : tokenASymbol;
};
