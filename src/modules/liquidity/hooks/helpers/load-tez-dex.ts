import { findDex, FoundDex, Token as QuipuswapSdkToken } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';

import { FACTORIES } from '@config/config';
import { Nullable, QSNets, Token } from '@shared/types';

import { findNotTezToken } from '../../liquidity-cards/helpers';

export const loadTezDex = async ({
  tezos,
  networkId,
  tokenA,
  tokenB
}: {
  tezos: TezosToolkit;
  networkId: QSNets;
  tokenA: Token;
  tokenB: Token;
}): Promise<Nullable<FoundDex>> => {
  try {
    const notTezToken = findNotTezToken([tokenA, tokenB]);
    if (!notTezToken) {
      return null;
    }
    const token: QuipuswapSdkToken = {
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
