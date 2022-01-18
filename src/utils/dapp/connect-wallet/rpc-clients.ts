import { HANGZHOUNET_NETWORK, MAINNET_NETWORK } from '@app.config';
import { QSMainNet } from '@utils/types';

import { FastRpcClient } from '../taquito-fast-rpc';

export const rpcClients: Record<QSMainNet, FastRpcClient> = {
  hangzhounet: new FastRpcClient(HANGZHOUNET_NETWORK.rpcBaseURL),
  mainnet: new FastRpcClient(MAINNET_NETWORK.rpcBaseURL)
};
