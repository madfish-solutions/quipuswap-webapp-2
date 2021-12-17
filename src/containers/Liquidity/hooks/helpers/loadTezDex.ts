import { findDex, FoundDex, Token } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';

import { findNotTezTokenInPair } from '@containers/Liquidity/liquidutyHelpers';
import { FACTORIES } from '@utils/defaults';
import { Nullable, QSMainNet, WhitelistedToken } from '@utils/types';

export const loadTezDex = async ({
  tezos,
  networkId,
  tokenA,
  tokenB
}: {
  tezos: TezosToolkit;
  networkId: QSMainNet;
  tokenA: WhitelistedToken;
  tokenB: WhitelistedToken;
}): Promise<Nullable<FoundDex>> => {
  try {
    const notTezToken = findNotTezTokenInPair(tokenA, tokenB);
    const token: Token = {
      contract: notTezToken.contractAddress,
      id: notTezToken.fa2TokenId
    };

    return await findDex(tezos, FACTORIES[networkId], token);
  } catch (error) {
    // TODO: Add Toaster
    // eslint-disable-next-line no-console
    console.log('error', error);
  }

  return null;
};
