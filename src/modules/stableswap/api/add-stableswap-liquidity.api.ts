import { TezosToolkit, MichelsonMap } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { withApproveApiForManyTokens } from '@blockchain';
import { STABLESWAP_REFERRAL } from '@config/config';
import { DEFAULT_STABLESWAP_POOL_ID } from '@config/constants';
import { AmountToken } from '@shared/types';

export const addStableswapLiquidityApi = async (
  tezos: TezosToolkit,
  stableswapPoolContractAddress: string,
  shares: BigNumber,
  tokensAndAmounts: Array<AmountToken>,
  deadline: string,
  accountPkh: string,
  receiver: Nullable<string> = null
) => {
  const receiverFixed = accountPkh === receiver ? null : receiver;
  const stableswapPoolContract = await tezos.wallet.at(stableswapPoolContractAddress);

  const michelsonAmounts = new MichelsonMap();
  tokensAndAmounts.forEach(({ amount }, index) => michelsonAmounts.set(index, amount));

  const swableswapLiquidityParams = stableswapPoolContract.methods
    .invest(DEFAULT_STABLESWAP_POOL_ID, shares, michelsonAmounts, deadline, receiverFixed, STABLESWAP_REFERRAL)
    .toTransferParams();

  return await withApproveApiForManyTokens(tezos, stableswapPoolContractAddress, tokensAndAmounts, accountPkh, [
    swableswapLiquidityParams
  ]);
};
