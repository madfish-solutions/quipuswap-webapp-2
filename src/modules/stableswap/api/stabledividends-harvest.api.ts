import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { sendBatch } from '@blockchain';
import { DEFAULT_STABLESWAP_POOL_ID, ZERO_AMOUNT } from '@config/constants';
import { toArray } from '@shared/helpers';

export const stableDividendsHarvestApi = async (
  tezos: TezosToolkit,
  stableswapPoolContractAddresses: Array<string> | string
) => {
  const stableswapPoolContracts = await Promise.all(
    toArray(stableswapPoolContractAddresses).map(async contractAddress => tezos.wallet.at(contractAddress))
  );

  const swableswapLiquidityParams = stableswapPoolContracts.map(contract =>
    contract.methods.add(DEFAULT_STABLESWAP_POOL_ID, new BigNumber(ZERO_AMOUNT)).toTransferParams()
  );

  return await sendBatch(tezos, swableswapLiquidityParams);
};
