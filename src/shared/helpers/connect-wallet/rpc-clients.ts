import { NetworkType } from '@airgap/beacon-sdk';

import { RPC_URLS } from '@config/enviroment';
import { SupportedNetworks } from '@shared/types';

import { FastRpcClient } from '../taquito-fast-rpc';

export const rpcClients: Record<SupportedNetworks, FastRpcClient> = {
  [NetworkType.MAINNET]: new FastRpcClient(RPC_URLS[NetworkType.MAINNET]),
  [NetworkType.HANGZHOUNET]: new FastRpcClient(RPC_URLS[NetworkType.HANGZHOUNET]),
  [NetworkType.ITHACANET]: new FastRpcClient(RPC_URLS[NetworkType.ITHACANET])
};
