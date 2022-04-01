import { TokenId } from '@shared/types';

import { getTokenSlug } from './get-token-slug';

export function getTokenPairSlug(token1: TokenId, token2: TokenId) {
  return `${getTokenSlug(token1)}-${getTokenSlug(token2)}`;
}
