import { NetworkType as BeaconNetworkType } from '@airgap/beacon-sdk';

import {
  NETWORK_ID_KEY,
  DEFAULT_NETWORK,
  ALL_NETWORKS,
  LAST_USED_ACCOUNT_KEY,
  LAST_USED_CONNECTION_KEY
} from '../../config/config';
import { QSNetwork, QSMainNet } from '../types/types';

export const getNetwork = () => {
  const netId = typeof window === 'undefined' ? undefined : localStorage.getItem(NETWORK_ID_KEY);
  if (!netId) {
    return DEFAULT_NETWORK;
  }
  const found = ALL_NETWORKS.find(n => n.id === netId);

  return found && !found.disabled ? found : DEFAULT_NETWORK;
};

export const setNetwork = (net: QSNetwork) => {
  localStorage.setItem(NETWORK_ID_KEY, net.id);
  localStorage.removeItem(LAST_USED_ACCOUNT_KEY);
  localStorage.removeItem(LAST_USED_CONNECTION_KEY);
};

const beaconNetworkTypes: Record<QSMainNet, BeaconNetworkType> = {
  mainnet: BeaconNetworkType.MAINNET,
  hangzhounet: BeaconNetworkType.HANGZHOUNET
};

export const toBeaconNetworkType = (netId: QSMainNet) => beaconNetworkTypes[netId];
