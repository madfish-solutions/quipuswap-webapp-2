import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { withApproveApiForManyTokens } from '@blockchain';
import { QUIPUSWAP_REFERRAL_CODE } from '@config/constants';
import {
  calculateLiquidity,
  calculateTickIndex,
  calculateTickPrice
} from '@modules/liquidity/pages/v3-item-page/helpers';
import { getContract } from '@shared/dapp';
import { decreaseByPercentage, findLeftElement, getTransactionDeadline } from '@shared/helpers';
import { AmountToken, Token } from '@shared/types';

export namespace V3Positions {
  export const doNewPositionTransaction = async (
    tezos: TezosToolkit,
    accountPkh: string,
    contractAddress: string,

    tokenX: Token,
    tokenY: Token,

    transactionDeadline: BigNumber,
    liquiditySlippage: BigNumber,

    currentTickIndex: BigNumber,

    minPrice: BigNumber,
    maxPrice: BigNumber,

    xTokenAmount: BigNumber,
    yTokenAmount: BigNumber,

    ticks: number[]
  ) => {
    const contract = await getContract(tezos, contractAddress);

    const lowerTickIndex = calculateTickIndex(minPrice);
    const upperTickIndex = calculateTickIndex(maxPrice);
    const currentTickPrice = calculateTickPrice(currentTickIndex);

    const deadline = await getTransactionDeadline(tezos, transactionDeadline);

    const liquidity = calculateLiquidity(
      currentTickIndex,
      lowerTickIndex,
      upperTickIndex,
      currentTickPrice,
      minPrice,
      maxPrice,
      xTokenAmount,
      yTokenAmount
    );
    const liquidityWithSlippage = decreaseByPercentage(liquidity, liquiditySlippage).integerValue(BigNumber.ROUND_DOWN);

    const lowerTickWitness = new BigNumber(findLeftElement(ticks, lowerTickIndex.toNumber()));
    const upperTickWitness = new BigNumber(findLeftElement(ticks, upperTickIndex.toNumber()));

    // TODO https://better-call.dev/ghostnet/KT1Sy7BKFpAMypwHN25qmDiLbv4CZqAMH3g4/interact/set_position
    const operationParams = contract.methods
      .set_position(
        lowerTickIndex,
        upperTickIndex,

        // TODO: Get all ticks from the contract (left numbers from tick_index (both))
        lowerTickWitness, // lower_tick_witness
        upperTickWitness, // upper_tick_witness

        liquidityWithSlippage,

        deadline,

        xTokenAmount, // maximum_tokens_contributed X
        yTokenAmount, // maximum_tokens_contributed Y

        QUIPUSWAP_REFERRAL_CODE
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
