import { WhitelistedToken } from '@utils/types';

import { isTokenEqual } from './isTokenEqual';

export const isPairEqual = (
  pair1A: WhitelistedToken,
  pair1B: WhitelistedToken,
  pair2A: WhitelistedToken,
  pair2B: WhitelistedToken
) => isTokenEqual(pair1A, pair2A) && isTokenEqual(pair1B, pair2B);
