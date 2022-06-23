import { FoundDex } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';

import { TOKEN_TO_TOKEN_DEX } from '@config/enviroment';
import { getStorageInfo } from '@shared/dapp';

export const loadT2tDex = async ({ tezos }: { tezos: TezosToolkit }) => {
  if (TOKEN_TO_TOKEN_DEX) {
    try {
      const contractPromise = tezos.wallet.at(TOKEN_TO_TOKEN_DEX);
      const storagePromise = getStorageInfo(tezos, TOKEN_TO_TOKEN_DEX);
      const [contract, storage] = await Promise.all([contractPromise, storagePromise]);

      return new FoundDex(contract, storage);
    } catch (error) {
      // TODO: Add Toaster
      // eslint-disable-next-line no-console
      console.log('error', error);
    }
  }

  return null;
};
