import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { withApproveApiForManyTokens } from '@blockchain';
import { ZERO_BAKER_ADDRESS } from '@config/constants';
import { DEX_TWO_CONTRACT_ADDRESS } from '@config/environment';
import { isGreaterThanZero } from '@shared/helpers';
import { AmountToken } from '@shared/types';

import { getTezValue } from '../helpers/get-tez-value';

export const addDexTwoLiquidityApi = async (
  tezos: TezosToolkit,
  shares: BigNumber,
  tokensAndAmounts: Array<AmountToken>,
  deadline: string,
  accountPkh: string,
  candidate: string,
  itemId: BigNumber
) => {
  if (!candidate) {
    candidate = ZERO_BAKER_ADDRESS;
  }

  const dexTwoContract = await tezos.wallet.at(DEX_TWO_CONTRACT_ADDRESS);

  const tezValue = getTezValue(tokensAndAmounts);

  const [tokenA, tokenB] = tokensAndAmounts;

  const dexTwoLiquidityParams = dexTwoContract.methods
    .invest_liquidity(itemId, tokenA.amount, tokenB.amount, shares, accountPkh, candidate, deadline)
    .toTransferParams({ mutez: true, amount: tezValue.toNumber() });

  const cleanedTokensAmount = tokensAndAmounts.filter(({ amount }) => isGreaterThanZero(amount));

  return await withApproveApiForManyTokens(tezos, DEX_TWO_CONTRACT_ADDRESS, cleanedTokensAmount, accountPkh, [
    dexTwoLiquidityParams
  ]);
};
