import { NetworkType } from '@airgap/beacon-sdk';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit } from '@taquito/taquito';

import {
  APP_NAME,
  BASE_URL,
  IS_NETWORK_MAINNET,
  LAST_USED_ACCOUNT_KEY,
  LAST_USED_CONNECTION_KEY,
  NETWORK,
  NETWORK_ID
} from '@config/config';
import { NoBeaconWallet, WalletNotConnected } from '@shared/errors';
import { ConnectType, LastUsedConnectionKey, QSNets, QSNetwork } from '@shared/types';

import { toBeaconNetworkType } from '../network';
import { ReadOnlySigner } from '../readonly-signer';
import { isDefaultConnectType } from './is-default-connect-type';
import { michelEncoder } from './michel-encoder';
import { rpcClients } from './rpc-clients';

export const beaconWallet =
  typeof window === 'undefined'
    ? undefined
    : new BeaconWallet({
        name: APP_NAME,
        iconUrl: `${BASE_URL}/favicon.ico`,
        preferredNetwork: (() => {
          if (NETWORK.connectType === ConnectType.DEFAULT || IS_NETWORK_MAINNET) {
            return toBeaconNetworkType(QSNets.mainnet);
          }

          return toBeaconNetworkType(NETWORK_ID);
        })()
      });

export const connectWalletBeacon = async (forcePermission: boolean, qsNetwork: QSNetwork) => {
  if (!beaconWallet) {
    throw new NoBeaconWallet();
  }

  const activeAccount = await beaconWallet.client.getActiveAccount();
  if (forcePermission || !activeAccount) {
    if (activeAccount) {
      await beaconWallet.clearActiveAccount();
    }
    const network =
      isDefaultConnectType(qsNetwork) || IS_NETWORK_MAINNET
        ? { type: toBeaconNetworkType(qsNetwork.id) }
        : {
            type: NetworkType.CUSTOM,
            name: qsNetwork.name,
            rpcUrl: qsNetwork.rpcBaseURL
          };
    await beaconWallet.requestPermissions({ network });
  }

  const tezos = new TezosToolkit(rpcClients[qsNetwork.id]);
  tezos.setPackerProvider(michelEncoder);
  tezos.setWalletProvider(beaconWallet);
  const activeAcc = await beaconWallet.client.getActiveAccount();
  if (!activeAcc) {
    throw new WalletNotConnected();
  }

  tezos.setSignerProvider(new ReadOnlySigner(activeAcc.address, activeAcc.publicKey));
  localStorage.setItem(LAST_USED_CONNECTION_KEY, LastUsedConnectionKey.BEACON);
  localStorage.setItem(LAST_USED_ACCOUNT_KEY, activeAcc.accountIdentifier);

  return { pkh: activeAcc.address, pk: activeAcc.publicKey, toolkit: tezos };
};
