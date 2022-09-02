import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { withApproveApiForManyTokens } from '@blockchain';
import { AmountToken } from '@shared/types';

// TODO: remove any

export const createNewLiquidityPoolApi = async (
  tezos: TezosToolkit,
  newLiquidityContractAddress: string,
  tokensAndAmounts: Array<AmountToken>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tokensPairParams: any,
  token_a_in: BigNumber,
  token_b_in: BigNumber,
  accountPkh: string,
  candidate: string,
  timestamp: string
) => {
  const newLiquidityPoolContract = await tezos.wallet.at(newLiquidityContractAddress);

  const addPoolTransferParams = newLiquidityPoolContract.methods
    .launch_exchange(token_a_in, token_b_in, accountPkh, candidate, timestamp, tokensPairParams)
    .toTransferParams();

  return await withApproveApiForManyTokens(tezos, newLiquidityContractAddress, tokensAndAmounts, accountPkh, [
    addPoolTransferParams
  ]);
};
