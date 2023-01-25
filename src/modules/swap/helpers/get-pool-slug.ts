import { getTokenSlug } from '@shared/helpers';

import { DexPool } from '../types';

export const getPoolSlug = (pool: DexPool) =>
  getTokenSlug({ contractAddress: pool.dexAddress, fa2TokenId: pool.dexId?.toNumber() });
