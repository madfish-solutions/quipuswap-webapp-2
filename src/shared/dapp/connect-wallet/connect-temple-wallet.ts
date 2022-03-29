import { TempleWallet } from '@temple-wallet/dapp';

import { APP_NAME, LAST_USED_CONNECTION_KEY } from '@config';
import { NoTempleWallet } from '@shared/errors/no-temple-wallet.error';
import { isDefaultConnectType } from '@shared/helpers/is-default-connect-type';
import { QSNetwork } from 'types/types';
import { LastUsedConnectionKey } from 'types/types';

import { getTempleWalletState } from './get-temple-wallet-state';

export const connectWalletTemple = async (forcePermission: boolean, network: QSNetwork) => {
  const available = await TempleWallet.isAvailable();
  if (!available) {
    throw new NoTempleWallet();
  }

  let perm;
  if (!forcePermission) {
    perm = await TempleWallet.getCurrentPermission();
  }

  const wallet = new TempleWallet(APP_NAME, perm);

  if (!wallet.connected) {
    const params = isDefaultConnectType(network)
      ? (network.id as never)
      : {
          name: network.name,
          rpc: network.rpcBaseURL
        };

    await wallet.connect(params, { forcePermission: true });
  }

  const { pkh, pk, tezos } = await getTempleWalletState(wallet, network.id);
  localStorage.setItem(LAST_USED_CONNECTION_KEY, LastUsedConnectionKey.TEMPLE);

  return { pkh, pk, toolkit: tezos, wallet };
};
