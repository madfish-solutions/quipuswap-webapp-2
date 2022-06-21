import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { sendBatch } from '@blockchain';
import { DEFAULT_STABLESWAP_POOL_ID, ZERO_AMOUNT } from '@config/constants';
import { toArray } from '@shared/helpers';

export const stableFarmHarvestApi = async (
  tezos: TezosToolkit,
  stableswapPoolContractAddresses: Array<string> | string
) => {
  const stableswapPoolContracts = await Promise.all(
    toArray(stableswapPoolContractAddresses).map(async contractAddress => tezos.wallet.at(contractAddress))
  );

  const poolId = new BigNumber(DEFAULT_STABLESWAP_POOL_ID);

  const swableswapLiquidityParams = stableswapPoolContracts.map(contract =>
    contract.methods.add(poolId, new BigNumber(ZERO_AMOUNT)).toTransferParams()
  );

  return await sendBatch(tezos, swableswapLiquidityParams);
};
