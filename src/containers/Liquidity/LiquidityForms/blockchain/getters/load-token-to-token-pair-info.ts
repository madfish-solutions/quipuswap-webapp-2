import { FoundDex } from '@quipuswap/sdk';

import { Nullable, WhitelistedToken } from '@utils/types';

import { PairInfo } from '../../add-liquidity-form';
import { newGetValidMichelTemplate } from '../../helpers/new-get-valid-michel-template';
import { sortTokensPair } from '../../helpers/sort-tokens-pair';

// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
const MichelCodec = require('@taquito/michel-codec');

export const loadTokenToTokenPairInfo = async (
  dex: FoundDex,
  tokenA: WhitelistedToken,
  tokenB: WhitelistedToken
): Promise<Nullable<PairInfo>> => {
  const sortedTokens = sortTokensPair(tokenA, tokenB);

  const michelData = newGetValidMichelTemplate(sortedTokens);
  const key = Buffer.from(MichelCodec.packData(michelData)).toString('hex');

  const id = await dex.storage.storage.token_to_id.get(key);

  if (!id) {
    return null;
  }

  const data = await dex.storage.storage.pairs.get(id);

  return {
    id,
    tokenA: sortedTokens.tokenA,
    tokenB: sortedTokens.tokenB,
    totalSupply: data.total_supply,
    tokenAPool: data.token_a_pool,
    tokenBPool: data.token_b_pool
  };
};
