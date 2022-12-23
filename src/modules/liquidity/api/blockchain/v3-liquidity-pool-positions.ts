import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { withApproveApiForManyTokens } from '@blockchain';
import { MIN_TICK_INDEX, MIN_TICK_WITNESS_INDEX, QUIPUSWAP_REFERRAL_CODE } from '@config/constants';
import { calculateLiquidity, calculateTick, calculateTickPrice } from '@modules/liquidity/pages/v3-item-page/helpers';
import { Tzkt } from '@shared/api';
import { getContract } from '@shared/dapp';
import { decreaseByPercentage, getFirstElement, getTransactionDeadline } from '@shared/helpers';
import { AmountToken, Token, Undefined } from '@shared/types';

interface ILiquidityTickRaw {
  id: number;
  key: string;
  value: {
    next: string;
    sqrt_price: string;
  };
}

export namespace V3Positions {
  export const getTickWitnessIndex = async (contractAddress: string, tickIndex: BigNumber) => {
    if (tickIndex.eq(MIN_TICK_INDEX)) {
      return MIN_TICK_WITNESS_INDEX;
    }

    const rawTicks = await Tzkt.getContractBigmapKeys<ILiquidityTickRaw>(contractAddress, 'ticks', {
      'key.lt': tickIndex.toNumber(),
      'value.next.ge': tickIndex.toNumber()
    });

    return new BigNumber(getFirstElement(rawTicks)?.key ?? MIN_TICK_INDEX);
  };

  export const doNewPositionTransaction = async (
    tezos: TezosToolkit,
    accountPkh: string,
    contractAddress: string,
    tickSpacing: Undefined<number>,

    tokenX: Token,
    tokenY: Token,

    transactionDeadline: BigNumber,
    liquiditySlippage: BigNumber,

    currentTickIndex: BigNumber,

    minPrice: BigNumber,
    maxPrice: BigNumber,

    xTokenAmount: BigNumber,
    yTokenAmount: BigNumber
  ) => {
    const contract = await getContract(tezos, contractAddress);

    const lowerTick = calculateTick(minPrice, tickSpacing);
    const upperTick = calculateTick(maxPrice, tickSpacing);
    const currentTickPrice = calculateTickPrice(currentTickIndex);

    const deadline = await getTransactionDeadline(tezos, transactionDeadline);

    const liquidity = calculateLiquidity(
      currentTickIndex,
      lowerTick.index,
      upperTick.index,
      currentTickPrice,
      lowerTick.price,
      upperTick.price,
      xTokenAmount,
      yTokenAmount
    );
    const liquidityWithSlippage = decreaseByPercentage(liquidity, liquiditySlippage).integerValue(BigNumber.ROUND_DOWN);

    const [lowerTickWitness, upperTickWitness] = await Promise.all([
      await V3Positions.getTickWitnessIndex(contractAddress, lowerTick.index),
      await V3Positions.getTickWitnessIndex(contractAddress, upperTick.index)
    ]);

    // TODO https://better-call.dev/ghostnet/KT1Sy7BKFpAMypwHN25qmDiLbv4CZqAMH3g4/interact/set_position
    const operationParams = contract.methods
      .set_position(
        lowerTick.index,
        upperTick.index,

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
