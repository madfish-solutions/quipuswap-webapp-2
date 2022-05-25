import { TezosToolkit, MichelsonMap } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { withApproveApiForManyTokens } from '@blockchain';
import { DEFAULT_POOL_ID } from '@config/constants';
import { STABLESWAP_REFERRAL } from '@config/enviroment';
import { AmountToken } from '@shared/types';

export const addStableswapLiquidityApi = async (
  tezos: TezosToolkit,
  stableswapPoolContractAddress: string,
  shares: BigNumber,
  tokensAndAmounts: Array<AmountToken>,
  deadline: Date,
  accountPkh: string,
  receiver: Nullable<string> = null
) => {
  const receiverFixed = accountPkh === receiver ? null : receiver;
  const stableswapPoolContract = await tezos.wallet.at(stableswapPoolContractAddress);

  const michelsonAmounts = new MichelsonMap<number, BigNumber>();

  let i = 0;
  for (const { amount } of tokensAndAmounts) {
    michelsonAmounts.set(i, amount);
    i++;
  }

  const swableswapLiquidityParams = stableswapPoolContract.methods
    .invest(DEFAULT_POOL_ID, shares, michelsonAmounts, deadline, receiverFixed, STABLESWAP_REFERRAL)
    .toTransferParams();

  return await withApproveApiForManyTokens(tezos, stableswapPoolContractAddress, tokensAndAmounts, accountPkh, [
    swableswapLiquidityParams
  ]);
};
