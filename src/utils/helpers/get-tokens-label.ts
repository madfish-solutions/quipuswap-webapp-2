import { getWhitelistedTokenSymbol } from '@utils/helpers/index';
import { Optional, WhitelistedToken } from '@utils/types';

export const getTokensLabel = (inputToken: Optional<WhitelistedToken>, outputToken: Optional<WhitelistedToken>) => {
  const inputTokenLabel = inputToken ? getWhitelistedTokenSymbol(inputToken) : '';
  const outputTokenLabel = outputToken ? getWhitelistedTokenSymbol(outputToken) : '';

  return inputTokenLabel && outputTokenLabel ? `${inputTokenLabel}-${outputTokenLabel}` : '';
};
