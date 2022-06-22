import { TOKEN_TO_TOKEN_DEX } from '@config/config';
import { getPriceImpact, toDecimals } from '@shared/helpers';

import { SwapDetailsParams } from '../utils/types';

const WHOLE_ITEM_PERCENT = 100;

export const usePriceImpact = ({ inputToken, inputAmount, dexRoute, slippageTolerance }: SwapDetailsParams) => {
  return inputToken && inputAmount && dexRoute && slippageTolerance
    ? getPriceImpact({
        inputToken: inputToken,
        inputAmount: toDecimals(inputAmount, inputToken),
        dexChain: dexRoute,
        slippageTolerance: slippageTolerance?.div(WHOLE_ITEM_PERCENT),
        ttDexAddress: TOKEN_TO_TOKEN_DEX
      })
    : null;
};
