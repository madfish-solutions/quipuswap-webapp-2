import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { sendBatch } from '@blockchain';
import { QUIPUSWAP_REFERRAL_CODE, DEX_TWO_DEFAULT_BAKER_ADDRESS } from '@config/constants';
import { DEX_TWO_CONTRACT_ADDRESS, NETWORK_ID } from '@config/environment';
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
  if (!candidate) {
    candidate = DEX_TWO_DEFAULT_BAKER_ADDRESS[NETWORK_ID];
  }

  const dexTwoContract = await tezos.wallet.at(DEX_TWO_CONTRACT_ADDRESS);

  const [tokenA, tokenB] = tokensAndAmounts;

  const dexTwoLiquidityParams = dexTwoContract.methods
    .divest_liquidity(
      itemId,
      tokenA.amount,
      tokenB.amount,
      shares,
      accountPkh,
      candidate,
      deadline,
      QUIPUSWAP_REFERRAL_CODE
    )
    .toTransferParams();

  return await sendBatch(tezos, [dexTwoLiquidityParams]);
};
