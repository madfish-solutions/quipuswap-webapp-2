import { getTokensPairName } from '@utils/helpers/index';
import { Optional, WhitelistedToken } from '@utils/types';

export const getTokensLabel = (inputToken: Optional<WhitelistedToken>, outputToken: Optional<WhitelistedToken>) => {
  return inputToken && outputToken ? getTokensPairName(inputToken, outputToken) : '';
};
