import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { withApproveApiForManyTokens } from '@blockchain';
import { AmountToken, Token } from '@shared/types';

export namespace V3Positions {
  export const doNewPositionTransaction = async (
    tezos: TezosToolkit,
    accountPkh: string,
    contractAddress: string,
    tokenX: Token,
    tokenY: Token
  ) => {
    const contract = await tezos.wallet.at(contractAddress);
    // eslint-disable-next-line no-console
    console.log('contractAddress', contractAddress, contract);

    // TODO https://better-call.dev/ghostnet/KT1Sy7BKFpAMypwHN25qmDiLbv4CZqAMH3g4/interact/set_position
    const operationParams = contract.methods
      .set_position(
        0, // lower_tick_index
        0, // upper_tick_index
        0, // lower_tick_witness
        0, // upper_tick_witness
        0, // liquidity
        0, // deadline
        0, // maximum_tokens_contributed
        0, // referral_code
        0, // maximum_tokens_contributed X
        0 // maximum_tokens_contributed Y
      )
      .toTransferParams({});

    const tokensAmount: AmountToken[] = [
      {
        token: tokenX,
        amount: new BigNumber(0)
      },
      {
        token: tokenY,
        amount: new BigNumber(0)
      }
    ];

    return await withApproveApiForManyTokens(tezos, contractAddress, tokensAmount, accountPkh, [operationParams]);
  };
}
