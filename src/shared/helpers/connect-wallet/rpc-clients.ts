import { RPC_URL } from '@config/enviroment';

import { FastRpcClient } from '../taquito-fast-rpc';

export const rpcClient = new FastRpcClient(RPC_URL);
