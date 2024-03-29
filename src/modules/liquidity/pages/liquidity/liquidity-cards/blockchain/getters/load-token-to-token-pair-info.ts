import { FoundDex } from '@quipuswap/sdk';

import { Nullable, Token } from '@shared/types';

import { PairInfo } from '../../add-liquidity-form';
import { newGetValidMichelTemplate, sortTokensPair } from '../../helpers';

// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
const MichelCodec = require('@taquito/michel-codec');

export const loadTokenToTokenPairInfo = async (
  dex: FoundDex,
  tokenA: Token,
  tokenB: Token
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
