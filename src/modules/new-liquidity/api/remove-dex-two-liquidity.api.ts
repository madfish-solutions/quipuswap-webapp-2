import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { sendBatch } from '@blockchain';
import { DEX_TWO_CONTRACT_ADDRESS } from '@config/environment';
import { sortTokensAmounts } from '@shared/helpers';
import { AmountToken } from '@shared/types';

// TODO: temporary/ until the field appears on the backend
const ZERO_BAKER_ADDRESS = 'tz1burnburnburnburnburnburnburjAYjjX';

export const removeDexTwoLiquidityApi = async (
  tezos: TezosToolkit,
  shares: BigNumber,
  tokensAndAmounts: Array<AmountToken>,
  deadline: string,
  accountPkh: string,
  itemId: BigNumber
) => {
  const dexTwoContract = await tezos.wallet.at(DEX_TWO_CONTRACT_ADDRESS);
  const sortedTokes = sortTokensAmounts(tokensAndAmounts);

  const dexTwoLiquidityParams = dexTwoContract.methods
    .divest_liquidity(
      itemId,
      sortedTokes.amountA,
      sortedTokes.amountB,
      shares,
      accountPkh,
      ZERO_BAKER_ADDRESS,
      deadline
    )
    .toTransferParams();

  return await sendBatch(tezos, [dexTwoLiquidityParams]);
};
