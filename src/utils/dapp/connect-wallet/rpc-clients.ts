import { HANGZHOUNET_RPC_URL, ITHACANET_RPC_URL, MAINNET_RPC_URL } from '@app.config';
import { QSNets } from '@utils/types';

import { FastRpcClient } from '../taquito-fast-rpc';

export const rpcClients: Record<QSNets, FastRpcClient> = {
  [QSNets.mainnet]: new FastRpcClient(MAINNET_RPC_URL),
  [QSNets.hangzhounet]: new FastRpcClient(HANGZHOUNET_RPC_URL),
  [QSNets.ithacanet]: new FastRpcClient(ITHACANET_RPC_URL)
};
