import { FoundDex } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';

import { getStorageInfo } from '@utils/dapp';
import { TOKEN_TO_TOKEN_DEX } from '@utils/defaults';

export const loadT2tDex = async ({ tezos }: { tezos: TezosToolkit }) => {
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

  return null;
};
