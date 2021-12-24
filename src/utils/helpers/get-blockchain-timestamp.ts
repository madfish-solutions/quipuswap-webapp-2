import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

const DEFAULT_TIMESTAMP_DELTA = 0;

export const getBlockchainTimestamp = async (tezos: TezosToolkit, delta: BigNumber.Value = DEFAULT_TIMESTAMP_DELTA) => {
  const { timestamp: blockchainNow } = await tezos.rpc.getBlockHeader();

  return new BigNumber(new Date(blockchainNow).getTime()).idiv(1000).plus(delta);
};
