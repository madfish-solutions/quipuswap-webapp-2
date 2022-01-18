import { NetworkType } from '@airgap/beacon-sdk';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit } from '@taquito/taquito';

import { APP_NAME, BASE_URL, LAST_USED_ACCOUNT_KEY, LAST_USED_CONNECTION_KEY } from '@app.config';
import { QSNetwork, QSNetworkType } from '@utils/types';

import { getNetwork, toBeaconNetworkType } from '../network';
import { ReadOnlySigner } from '../ReadOnlySigner';
import { michelEncoder } from './michel-encoder';
import { rpcClients } from './rpc-clients';

export const beaconWallet =
  typeof window === 'undefined'
    ? undefined
    : new BeaconWallet({
        name: APP_NAME,
        iconUrl: `${BASE_URL}/favicon.ico`,
        preferredNetwork: (() => {
          const net = getNetwork();
          if (!(net.connectType === 'custom' && net.type === QSNetworkType.TEST)) {
            return toBeaconNetworkType(net.id);
          }

          return toBeaconNetworkType('mainnet');
        })()
      });

export const connectWalletBeacon = async (forcePermission: boolean, network: QSNetwork) => {
  if (!beaconWallet) {
    throw new Error('Cannot use beacon out of window');
  }

  const activeAccount = await beaconWallet.client.getActiveAccount();
  if (forcePermission || !activeAccount) {
    if (activeAccount) {
      await beaconWallet.clearActiveAccount();
    }
    await beaconWallet.requestPermissions({
      network:
        network.connectType === 'custom' && network.type === QSNetworkType.TEST
          ? {
              type: NetworkType.CUSTOM,
              name: network.name,
              rpcUrl: network.rpcBaseURL
            }
          : { type: toBeaconNetworkType(network.id) }
    });
  }

  const tezos = new TezosToolkit(rpcClients[network.id]);
  tezos.setPackerProvider(michelEncoder);
  tezos.setWalletProvider(beaconWallet);
  const activeAcc = await beaconWallet.client.getActiveAccount();
  if (!activeAcc) {
    throw new Error('Not connected');
  }

  tezos.setSignerProvider(new ReadOnlySigner(activeAcc.address, activeAcc.publicKey));
  localStorage.setItem(LAST_USED_CONNECTION_KEY, 'beacon');
  localStorage.setItem(LAST_USED_ACCOUNT_KEY, activeAcc.accountIdentifier);

  return { pkh: activeAcc.address, pk: activeAcc.publicKey, toolkit: tezos };
};
