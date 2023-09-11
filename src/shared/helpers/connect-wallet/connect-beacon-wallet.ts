/* eslint-disable import/order */
import { NetworkType } from '@airgap/beacon-types';
import { BeaconWallet } from '@taquito/beacon-wallet';

import { APP_NAME, IS_NETWORK_MAINNET, NETWORK } from '@config/config';
import { BASE_URL, NETWORK_ID } from '@config/environment';
import { LAST_USED_ACCOUNT_KEY, LAST_USED_CONNECTION_KEY } from '@config/localstorage';
import { makeBasicToolkit } from '@providers/use-dapp';
import { NoBeaconWallet, WalletNotConnected } from '@shared/errors';
import { SupportedNetworks, ConnectType, LastUsedConnectionKey, QSNetwork } from '@shared/types';

import { ReadOnlySigner } from '../readonly-signer';
import { FastRpcClient } from '../taquito-fast-rpc';
import { getPreferredRpcUrl } from './get-preferred-rpc-url';
import { isDefaultConnectType } from './is-default-connect-type';

const getPreferredNetwork = () => {
  if (NETWORK.connectType === ConnectType.DEFAULT || IS_NETWORK_MAINNET) {
    return NetworkType.MAINNET as SupportedNetworks;
  }

  return NETWORK_ID;
};

export const beaconWallet = new BeaconWallet({
  name: APP_NAME,
  iconUrl: `${BASE_URL}/favicon.ico`,
  preferredNetwork: getPreferredNetwork()
});

type Permissions = Required<Required<Parameters<typeof beaconWallet.requestPermissions>>[0]>;

export const connectWalletBeacon = async (forcePermission: boolean, qsNetwork: QSNetwork) => {
  const rpcUrl = getPreferredRpcUrl();
  const rpcClient = new FastRpcClient(rpcUrl);

  if (!beaconWallet) {
    throw new NoBeaconWallet();
  }

  const activeAccount = await beaconWallet.client.getActiveAccount();
  if (forcePermission || !activeAccount) {
    if (activeAccount) {
      await beaconWallet.clearActiveAccount();
    }
    const isMain = isDefaultConnectType(qsNetwork) || IS_NETWORK_MAINNET;

    const network = isMain
      ? ({
          type: qsNetwork.id
        } as { type: Permissions['network']['type'] })
      : ({
          type: NetworkType.CUSTOM,
          name: qsNetwork.name,
          rpcUrl
        } as Permissions['network']);

    const permissions: Omit<Permissions, 'scopes'> = {
      network
    };
    await beaconWallet.requestPermissions(permissions);
  }

  //@ts-ignore
  const tezos = makeBasicToolkit(rpcClient);
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
