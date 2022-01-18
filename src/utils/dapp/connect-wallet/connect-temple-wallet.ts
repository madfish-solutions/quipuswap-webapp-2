import { TempleWallet } from '@temple-wallet/dapp';

import { APP_NAME, LAST_USED_CONNECTION_KEY } from '@app.config';
import { QSNetwork } from '@utils/types';
import { NoTempleWalletError } from 'errors';

import { getTempleWalletState } from './get-temple-wallet-state';

export const connectWalletTemple = async (forcePermission: boolean, network: QSNetwork) => {
  const available = await TempleWallet.isAvailable();
  if (!available) {
    throw new NoTempleWalletError();
  }

  let perm;
  if (!forcePermission) {
    perm = await TempleWallet.getCurrentPermission();
  }

  const wallet = new TempleWallet(APP_NAME, perm);

  if (!wallet.connected) {
    await wallet.connect(
      network.connectType === 'default'
        ? (network.id as never)
        : {
            name: network.name,
            rpc: network.rpcBaseURL
          },
      { forcePermission: true }
    );
  }

  const { pkh, pk, tezos } = await getTempleWalletState(wallet, network.id);
  localStorage.setItem(LAST_USED_CONNECTION_KEY, 'temple');

  return { pkh, pk, toolkit: tezos, wallet };
};
