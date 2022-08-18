import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { withApproveApiForManyTokens } from '@blockchain';
import { DEX_TWO_CONTRACT_ADDRESS } from '@config/environment';
import { isGreaterThanZero } from '@shared/helpers';
import { AmountToken } from '@shared/types';

import { sortTokensAmounts } from '../helpers/sort-tokens-amount';

const ZERO_BAKER_ADDRESS = 'tz1burnburnburnburnburnburnburjAYjjX';

export const addNewLiquidityApi = async (
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
  const sortedTokes = sortTokensAmounts(tokensAndAmounts);

  const dexTwoLiquidityParams = dexTwoContract.methods
    .invest_liquidity(itemId, sortedTokes.amountA, sortedTokes.amountB, shares, accountPkh, candidate, deadline)
    .toTransferParams();

  const cleanedTokensAmount = tokensAndAmounts.filter(({ amount }) => isGreaterThanZero(amount));

  return await withApproveApiForManyTokens(tezos, DEX_TWO_CONTRACT_ADDRESS, cleanedTokensAmount, accountPkh, [
    dexTwoLiquidityParams
  ]);
};
