import { HANGZHOUNET_RPC_URL, MAINNET_RPC_URL } from '@app.config';
import { QSNets } from '@interfaces/types';

import { FastRpcClient } from '../taquito-fast-rpc';

export const rpcClients: Record<QSNets, FastRpcClient> = {
  hangzhounet: new FastRpcClient(HANGZHOUNET_RPC_URL),
  mainnet: new FastRpcClient(MAINNET_RPC_URL)
};
