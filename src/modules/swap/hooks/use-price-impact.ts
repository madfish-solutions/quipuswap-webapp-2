import { PERCENTAGE_100 } from '@config/constants';
import { TOKEN_TO_TOKEN_DEX } from '@config/enviroment';
import { getPriceImpact, toDecimals } from '@shared/helpers';

import { SwapDetailsParams } from '../utils/types';

export const usePriceImpact = ({ inputToken, inputAmount, dexRoute, slippageTolerance }: SwapDetailsParams) => {
  return inputToken && inputAmount && dexRoute && slippageTolerance
    ? getPriceImpact({
        inputToken: inputToken,
        inputAmount: toDecimals(inputAmount, inputToken),
        dexChain: dexRoute,
        slippageTolerance: slippageTolerance?.div(PERCENTAGE_100),
        ttDexAddress: TOKEN_TO_TOKEN_DEX
      })
    : null;
};
