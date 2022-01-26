import { NetworkType } from '@airgap/beacon-sdk';

export const toBeaconNetworkType = (netId: string) => (netId === 'edo2net' ? 'edonet' : netId) as NetworkType;
