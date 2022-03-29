import { HANGZHOUNET_RPC_URL, MAINNET_RPC_URL } from '@config';
import { QSNets } from 'types/types';

import { FastRpcClient } from '@shared/helpers/taquito-fast-rpc';

export const rpcClients: Record<QSNets, FastRpcClient> = {
  hangzhounet: new FastRpcClient(HANGZHOUNET_RPC_URL),
  mainnet: new FastRpcClient(MAINNET_RPC_URL)
};
