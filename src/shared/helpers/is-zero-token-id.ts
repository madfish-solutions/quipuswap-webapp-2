import { DEFAULT_TOKEN_ID } from '@config/constants';
import { Optional } from '@shared/types';

import { isExist } from './type-checks';

export const isZeroTokenId = (tokenId: Optional<number>) => {
  return !isExist(tokenId) || tokenId === DEFAULT_TOKEN_ID;
};
