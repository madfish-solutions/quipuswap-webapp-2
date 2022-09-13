import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { sendBatch } from '@blockchain';
import { ZERO_BAKER_ADDRESS } from '@config/constants';
import { DEX_TWO_CONTRACT_ADDRESS } from '@config/environment';
import { isExist } from '@shared/helpers';
import { AmountToken } from '@shared/types';

export const removeDexTwoLiquidityApi = async (
  tezos: TezosToolkit,
  shares: BigNumber,
  tokensAndAmounts: Array<AmountToken>,
  deadline: string,
  accountPkh: string,
  candidate: string,
  itemId: BigNumber
) => {
  if (!isExist(candidate)) {
    candidate = ZERO_BAKER_ADDRESS;
  }

  const dexTwoContract = await tezos.wallet.at(DEX_TWO_CONTRACT_ADDRESS);

  const [tokenA, tokenB] = tokensAndAmounts;

  const dexTwoLiquidityParams = dexTwoContract.methods
    .divest_liquidity(itemId, tokenA.amount, tokenB.amount, shares, accountPkh, candidate, deadline)
    .toTransferParams();

  return await sendBatch(tezos, [dexTwoLiquidityParams]);
};
