import { TezosToolkit } from '@taquito/taquito';
import { findDex, FoundDex } from '@quipuswap/sdk';

import { FACTORIES } from '@utils/defaults';
import { QSNetworkType, WhitelistedToken } from '@utils/types';

type GetDexParams = {
  tezos: TezosToolkit
  networkId: QSNetworkType
  token1: WhitelistedToken
  token2: WhitelistedToken
};

export const getDex = async ({
  tezos,
  networkId,
  token1,
  token2,
}: GetDexParams) : Promise<{ dexes: FoundDex[], storages: any }> => {
  const fromAsset = {
    contract: token1.contractAddress,
    id: token1.fa2TokenId ?? undefined,
  };
  const toAsset = {
    contract: token2.contractAddress,
    id: token2.fa2TokenId ?? undefined,
  };

  if (token1.contractAddress !== 'tez' && token2.contractAddress !== 'tez') {
    const dexbuf1 = await findDex(tezos, FACTORIES[networkId], fromAsset);
    const dexStorageBuf1:any = await dexbuf1.contract.storage();
    const dexbuf2 = await findDex(tezos, FACTORIES[networkId], toAsset);
    const dexStorageBuf2:any = await dexbuf2.contract.storage();
    return {
      dexes: [dexbuf1, dexbuf2],
      storages: [dexStorageBuf1, dexStorageBuf2],
    };
  }
  const dexbuf = await findDex(tezos, FACTORIES[networkId], token2.contractAddress === 'tez' ? fromAsset : toAsset);
  const dexStorageBuf:any = await dexbuf.contract.storage();
  return {
    dexes: [dexbuf],
    storages: [dexStorageBuf, undefined],
  };
};
