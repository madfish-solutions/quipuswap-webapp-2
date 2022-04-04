import { RPC_URLS } from '@config/enviroment';
import { QSNets } from '@shared/types';

import { FastRpcClient } from '../taquito-fast-rpc';

export const rpcClients: Record<QSNets, FastRpcClient> = {
  [QSNets.mainnet]: new FastRpcClient(RPC_URLS[QSNets.mainnet]),
  [QSNets.hangzhounet]: new FastRpcClient(RPC_URLS[QSNets.hangzhounet]),
  [QSNets.ithacanet]: new FastRpcClient(RPC_URLS[QSNets.ithacanet])
};
