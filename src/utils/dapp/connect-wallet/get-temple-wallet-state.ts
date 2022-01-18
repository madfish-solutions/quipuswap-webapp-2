import { TezosToolkit } from '@taquito/taquito';
import { TempleWallet } from '@temple-wallet/dapp';

import { QSMainNet } from '@utils/types';

import { ReadOnlySigner } from '../ReadOnlySigner';
import { michelEncoder } from './michel-encoder';
import { rpcClients } from './rpc-clients';

export const getTempleWalletState = async (wallet: TempleWallet, networkId: QSMainNet) => {
  const tezos = new TezosToolkit(rpcClients[networkId]);
  tezos.setWalletProvider(wallet);
  tezos.setPackerProvider(michelEncoder);
  tezos.setRpcProvider(rpcClients[networkId]);
  const pkh = wallet.connected ? await wallet.getPKH() : null;
  let pk: string | null = null;
  if (wallet.connected && pkh) {
    const { pkh, publicKey } = wallet.permission!;
    pk = publicKey;
    tezos.setSignerProvider(new ReadOnlySigner(pkh, publicKey));
  }

  return { pkh, tezos, pk };
};
