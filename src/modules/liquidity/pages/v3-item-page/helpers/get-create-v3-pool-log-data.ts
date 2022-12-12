import BigNumber from 'bignumber.js';

import { getTokenSlug, getTokenSymbol } from '@shared/helpers';
import { Token } from '@shared/types';

export const getCreateV3PoolLogData = (
  accountPkh: string,
  tokenX: Token,
  tokenY: Token,
  price: BigNumber,
  feePercentage: BigNumber
) => ({
  accountPkh,
  tokenXSlug: getTokenSlug(tokenX),
  tokenXSymbol: getTokenSymbol(tokenX),
  tokenYSlug: getTokenSlug(tokenY),
  tokenYSymbol: getTokenSymbol(tokenY),
  price: price.toNumber(),
  feePercentage: feePercentage.toNumber()
});
