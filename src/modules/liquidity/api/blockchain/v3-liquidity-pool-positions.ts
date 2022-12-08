import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { withApproveApiForManyTokens } from '@blockchain';
import { REFERRAL_CODE } from '@config/config';
import { decreaseBySlippage, getTransactionDeadline } from '@shared/helpers';
import { AmountToken, Token } from '@shared/types';

import { calculateTickIndex } from '../../helpers';

export namespace V3Positions {
  export const doNewPositionTransaction = async (
    tezos: TezosToolkit,
    accountPkh: string,
    contractAddress: string,
    tokenX: Token,
    tokenY: Token,
    transactionDeadline: BigNumber,
    liquiditySlippage: BigNumber,
    minPrice: BigNumber,
    maxPrice: BigNumber,
    xTokenAmount: BigNumber,
    yTokenAmount: BigNumber
  ) => {
    const contract = await tezos.wallet.at(contractAddress);

    const lowerTickIndex = calculateTickIndex(minPrice);
    const upperTickIndex = calculateTickIndex(maxPrice);

    const deadline = await getTransactionDeadline(tezos, transactionDeadline);

    // TODO: Calculate by formula
    const liquidity = new BigNumber('0');
    const liquidityWithSlippage = decreaseBySlippage(liquidity, liquiditySlippage).integerValue(BigNumber.ROUND_DOWN);

    // TODO https://better-call.dev/ghostnet/KT1Sy7BKFpAMypwHN25qmDiLbv4CZqAMH3g4/interact/set_position
    const operationParams = contract.methods
      .set_position(
        lowerTickIndex,
        upperTickIndex,

        // TODO: Get all ticks from the contract (left numbers from tick_index (both))
        0, // lower_tick_witness
        0, // upper_tick_witness

        liquidityWithSlippage,

        deadline,

        xTokenAmount, // maximum_tokens_contributed X
        yTokenAmount, // maximum_tokens_contributed Y

        REFERRAL_CODE
      )
      .toTransferParams({});

    const tokensAmount: AmountToken[] = [
      {
        token: tokenX,
        amount: xTokenAmount // maximum_tokens_contributed X
      },
      {
        token: tokenY,
        amount: yTokenAmount // maximum_tokens_contributed Y
      }
    ];

    return await withApproveApiForManyTokens(tezos, contractAddress, tokensAmount, accountPkh, [operationParams]);
  };
}
