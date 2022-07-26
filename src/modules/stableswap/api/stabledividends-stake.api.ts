import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { withApproveApi } from '@blockchain';
import { DEFAULT_STABLESWAP_POOL_ID } from '@config/constants';
import { QUIPU_TOKEN } from '@config/tokens';

export const stableDividendsStakeApi = async (
  tezos: TezosToolkit,
  stableswapPoolContractAddress: string,
  amount: BigNumber,
  accountPkh: string
) => {
  const stableswapPoolContract = await tezos.wallet.at(stableswapPoolContractAddress);

  const swableswapLiquidityParams = stableswapPoolContract.methods
    .add(DEFAULT_STABLESWAP_POOL_ID, amount)
    .toTransferParams();

  return await withApproveApi(tezos, stableswapPoolContractAddress, QUIPU_TOKEN, accountPkh, amount, [
    swableswapLiquidityParams
  ]);
};
