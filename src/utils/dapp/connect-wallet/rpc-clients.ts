import { HANGZHOUNET_NETWORK, MAINNET_NETWORK } from '@app.config';
import { QSNets } from '@utils/types';

import { FastRpcClient } from '../taquito-fast-rpc';

export const rpcClients: Record<QSNets, FastRpcClient> = {
  hangzhounet: new FastRpcClient(HANGZHOUNET_NETWORK.rpcBaseURL),
  mainnet: new FastRpcClient(MAINNET_NETWORK.rpcBaseURL)
};
