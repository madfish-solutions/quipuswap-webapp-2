import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { withApproveApi } from '@blockchain';
import { DEFAULT_TOKEN } from '@config/tokens';

export const stableswapFarmStakeApi = async (
  tezos: TezosToolkit,
  stableswapPoolContractAddress: string,
  amount: BigNumber,
  poolId: BigNumber,
  accountPkh: string
) => {
  const stableswapPoolContract = await tezos.wallet.at(stableswapPoolContractAddress);

  const swableswapLiquidityParams = stableswapPoolContract.methods.add(amount, poolId).toTransferParams();

  return await withApproveApi(tezos, stableswapPoolContractAddress, DEFAULT_TOKEN, accountPkh, amount, [
    swableswapLiquidityParams
  ]);
};
