import { TezosToolkit } from '@taquito/taquito';
import { TempleWallet } from '@temple-wallet/dapp';

import { SupportedNetworks } from '@shared/types';

import { ReadOnlySigner } from '../readonly-signer';
import { michelEncoder } from './michel-encoder';
import { rpcClient } from './rpc-clients';

export const getTempleWalletState = async (wallet: TempleWallet, networkId: SupportedNetworks) => {
  const tezos = new TezosToolkit(rpcClient);
  tezos.setWalletProvider(wallet);
  tezos.setPackerProvider(michelEncoder);
  tezos.setRpcProvider(rpcClient);
  const pkh = wallet.connected ? await wallet.getPKH() : null;
  let pk: string | null = null;
  if (wallet.connected && pkh) {
    const { pkh: _pkh, publicKey } = wallet.permission!;
    pk = publicKey;
    tezos.setSignerProvider(new ReadOnlySigner(_pkh, publicKey));
  }

  return { pkh, tezos, pk };
};
