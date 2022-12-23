import { EMPTY_STRING } from '@config/constants';
import { getTokenSymbol, isNull } from '@shared/helpers';

import { useLiquidityV3ItemTokens } from './use-liquidity-v3-item-tokens';

export const useLiquidityV3ItemTokensSymbols = () => {
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();

  return {
    tokenXSymbol: isNull(tokenX) ? EMPTY_STRING : getTokenSymbol(tokenX),
    tokenYSymbol: isNull(tokenY) ? EMPTY_STRING : getTokenSymbol(tokenY)
  };
};
