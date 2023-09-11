/* eslint-disable import/order */
import { makeBasicToolkit } from '@providers/use-dapp';
import { SupportedNetworks } from '@shared/types';

import { ReadOnlySigner } from '../readonly-signer';
import { FastRpcClient } from '../taquito-fast-rpc';
import { getPreferredRpcUrl } from './get-preferred-rpc-url';
import { TempleWalletWithPK } from './temple-wallet';

export const getTempleWalletState = async (wallet: TempleWalletWithPK, networkId: SupportedNetworks) => {
  const rpcClient = new FastRpcClient(getPreferredRpcUrl());
  const tezos = makeBasicToolkit(rpcClient);
  tezos.setWalletProvider(wallet);
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
