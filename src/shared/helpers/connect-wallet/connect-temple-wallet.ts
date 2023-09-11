import { TempleWallet } from '@temple-wallet/dapp';

import { APP_NAME } from '@config/config';
import { LAST_USED_CONNECTION_KEY } from '@config/localstorage';
import { NoTempleWallet } from '@shared/errors';
import { LastUsedConnectionKey, QSNetwork } from '@shared/types';

import { getPreferredRpcUrl } from './get-preferred-rpc-url';
import { getTempleWalletState } from './get-temple-wallet-state';
import { isDefaultConnectType } from './is-default-connect-type';
import { TempleWalletWithPK } from './temple-wallet';

export const connectWalletTemple = async (forcePermission: boolean, network: QSNetwork) => {
  const available = await TempleWallet.isAvailable();
  if (!available) {
    throw new NoTempleWallet();
  }

  let perm;
  if (!forcePermission) {
    perm = await TempleWallet.getCurrentPermission();
  }

  const wallet = new TempleWalletWithPK(APP_NAME, perm);

  if (!wallet.connected) {
    const params = isDefaultConnectType(network)
      ? network.id
      : {
          name: network.name,
          rpc: getPreferredRpcUrl()
        };

    await wallet.connect(params, { forcePermission: true });
  }

  const { pkh, pk, tezos } = await getTempleWalletState(wallet, network.id);
  localStorage.setItem(LAST_USED_CONNECTION_KEY, LastUsedConnectionKey.TEMPLE);

  return { pkh, pk, toolkit: tezos, wallet };
};
