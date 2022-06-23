import { MichelsonMap, TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { sendBatch } from '@blockchain';
import { STABLESWAP_REFERRAL } from '@config/config';
import { DEFAULT_STABLESWAP_POOL_ID } from '@config/constants';
import { AmountToken } from '@shared/types';

const createMichelsonMap = (tokensAndAmounts: Array<AmountToken & Partial<{ index: number }>>) => {
  const michelsonAmounts = new MichelsonMap<number, BigNumber>();

  tokensAndAmounts.forEach(({ amount, index }, i) => michelsonAmounts.set(index ?? i, amount));

  return michelsonAmounts;
};

export const removeStableswapLiquidityBalancedApi = async (
  tezos: TezosToolkit,
  stableswapPoolContractAddress: string,
  tokensAndAmounts: Array<AmountToken>,
  shares: BigNumber,
  deadline: Date,
  accountPkh: string,
  receiver: Nullable<string> = null
) => {
  const receiverFixed = accountPkh === receiver ? null : receiver;
  const stableswapPoolContract = await tezos.wallet.at(stableswapPoolContractAddress);
  const michelsonAmounts = createMichelsonMap(tokensAndAmounts);

  const removeSwableswapLiquidityParams = stableswapPoolContract.methods
    .divest(DEFAULT_STABLESWAP_POOL_ID, michelsonAmounts, shares, deadline, receiverFixed)
    .toTransferParams();

  return await sendBatch(tezos, [removeSwableswapLiquidityParams]);
};

export const removeStableswapLiquidityImbalancedApi = async (
  tezos: TezosToolkit,
  stableswapPoolContractAddress: string,
  tokensAndAmounts: Array<AmountToken>,
  shares: BigNumber,
  deadline: Date,
  accountPkh: string,
  receiver: Nullable<string> = null
) => {
  const receiverFixed = accountPkh === receiver ? null : receiver;
  const stableswapPoolContract = await tezos.wallet.at(stableswapPoolContractAddress);
  const michelsonAmounts = createMichelsonMap(tokensAndAmounts);

  const removeSwableswapLiquidityParams = stableswapPoolContract.methods
    .divest_imbalanced(
      DEFAULT_STABLESWAP_POOL_ID,
      michelsonAmounts,
      shares,
      deadline,
      receiverFixed,
      STABLESWAP_REFERRAL
    )
    .toTransferParams();

  return await sendBatch(tezos, [removeSwableswapLiquidityParams]);
};
