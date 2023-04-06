import { MichelsonMap, TezosToolkit, TransferParams } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { withWtezBurnOnOutput } from '@blockchain';
import { STABLESWAP_REFERRAL } from '@config/config';
import { DEFAULT_STABLESWAP_POOL_ID } from '@config/constants';
import { TEZOS_TOKEN } from '@config/tokens';
import { AmountToken, Nullable } from '@shared/types';

import { getTotalTokenAmount } from '../../../helpers';
import { Version } from '../../../types';
import { getYupanaRebalanceParams } from './utils';

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
  deadline: string,
  accountPkh: string,
  version: Version,
  receiver: Nullable<string> = null
) => {
  const mutezToBurn = getTotalTokenAmount(tokensAndAmounts, TEZOS_TOKEN);
  const receiverFixed = accountPkh === receiver ? null : receiver;
  const stableswapPoolContract = await tezos.wallet.at(stableswapPoolContractAddress);
  const michelsonAmounts = createMichelsonMap(tokensAndAmounts);

  const removeStableswapLiquidityParams = stableswapPoolContract.methods
    .divest(DEFAULT_STABLESWAP_POOL_ID, michelsonAmounts, shares, deadline, receiverFixed)
    .toTransferParams();

  let baseParams: Array<TransferParams> = [];
  if (version === Version.v2) {
    const params = await getYupanaRebalanceParams({
      tezos,
      stableswapContractAddress: stableswapPoolContractAddress,
      stableswapPoolId: DEFAULT_STABLESWAP_POOL_ID,
      tokensInPool: tokensAndAmounts.length
    });

    baseParams = baseParams.concat(params);
  }

  baseParams.push(removeStableswapLiquidityParams);

  return await withWtezBurnOnOutput(tezos, mutezToBurn, accountPkh, baseParams);
};

export const removeStableswapLiquidityImbalancedApi = async (
  tezos: TezosToolkit,
  stableswapPoolContractAddress: string,
  tokensAndAmounts: Array<AmountToken>,
  shares: BigNumber,
  deadline: string,
  accountPkh: string,
  version: Version,
  receiver: Nullable<string> = null
) => {
  const mutezToBurn = getTotalTokenAmount(tokensAndAmounts, TEZOS_TOKEN);
  const receiverFixed = accountPkh === receiver ? null : receiver;
  const stableswapPoolContract = await tezos.wallet.at(stableswapPoolContractAddress);
  const michelsonAmounts = createMichelsonMap(tokensAndAmounts);

  const removeStableswapLiquidityParams = stableswapPoolContract.methods
    .divest_imbalanced(
      DEFAULT_STABLESWAP_POOL_ID,
      michelsonAmounts,
      shares,
      deadline,
      receiverFixed,
      STABLESWAP_REFERRAL
    )
    .toTransferParams();

  let baseParams: Array<TransferParams> = [];
  if (version === Version.v2) {
    const params = await getYupanaRebalanceParams({
      tezos,
      stableswapContractAddress: stableswapPoolContractAddress,
      stableswapPoolId: DEFAULT_STABLESWAP_POOL_ID,
      tokensInPool: tokensAndAmounts.length
    });

    baseParams = baseParams.concat(params);
  }

  baseParams.push(removeStableswapLiquidityParams);

  return await withWtezBurnOnOutput(tezos, mutezToBurn, accountPkh, baseParams);
};
