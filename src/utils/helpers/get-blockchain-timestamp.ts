import { TezosToolkit } from '@taquito/taquito';

const DEFAULT_TIMESTAMP_DELTA = 0;

export const getBlockchainTimestamp = async (tezos: TezosToolkit, delta: number = DEFAULT_TIMESTAMP_DELTA) => {
  const { timestamp: blockchainNow } = await tezos.rpc.getBlockHeader();

  return Math.floor(new Date(blockchainNow).getTime() / 1000) + delta;
};
