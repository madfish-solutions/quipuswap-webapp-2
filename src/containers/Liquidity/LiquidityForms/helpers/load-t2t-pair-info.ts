import { FoundDex } from '@quipuswap/sdk';

import { PairInfo } from '@containers/Liquidity/LiquidityForms/add-liquidity-form/pair-info.interface';
import { newGetValidMichelTemplate } from '@containers/Liquidity/LiquidityForms/helpers/new-get-valid-michel-template';
import { sortTokensPair } from '@containers/Liquidity/LiquidityForms/helpers/sort-tokens-pair';
import { Nullable, WhitelistedToken } from '@utils/types';

// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
const MichelCodec = require('@taquito/michel-codec');

export const loadT2TPairInfo = async (
  dex: FoundDex,
  tokenA: WhitelistedToken,
  tokenB: WhitelistedToken
): Promise<Nullable<PairInfo>> => {
  const sortedTokens = sortTokensPair(tokenA, tokenB);

  const michelData = newGetValidMichelTemplate(sortedTokens);
  const key = Buffer.from(MichelCodec.packData(michelData)).toString('hex');

  const id = await dex.storage.storage.token_to_id.get(key);

  if (id) {
    const data = await dex.storage.storage.pairs.get(id);

    return {
      id,
      tokenA: sortedTokens.tokenA,
      tokenB: sortedTokens.tokenB,
      totalSupply: data.total_supply,
      tokenAPool: data.token_a_pool,
      tokenBPool: data.token_b_pool
    };
  }

  return null;
};
