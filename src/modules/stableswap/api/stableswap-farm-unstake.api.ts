import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { sendBatch } from '@blockchain';
import { DEFAULT_STABLESWAP_POOL_ID } from '@config/constants';

export const stableswapFarmUnstakeApi = async (
  tezos: TezosToolkit,
  stableswapPoolContractAddress: string,
  amount: BigNumber
) => {
  const stableswapPoolContract = await tezos.wallet.at(stableswapPoolContractAddress);

  const swableswapLiquidityParams = stableswapPoolContract.methods
    .remove(DEFAULT_STABLESWAP_POOL_ID, amount)
    .toTransferParams();

  return await sendBatch(tezos, [swableswapLiquidityParams]);
};
