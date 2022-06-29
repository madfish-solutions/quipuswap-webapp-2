import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { withApproveApi } from '@blockchain';
import { DEFAULT_STABLESWAP_POOL_ID } from '@config/constants';
import { DEFAULT_TOKEN } from '@config/tokens';

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

  return await withApproveApi(tezos, stableswapPoolContractAddress, DEFAULT_TOKEN, accountPkh, amount, [
    swableswapLiquidityParams
  ]);
};
