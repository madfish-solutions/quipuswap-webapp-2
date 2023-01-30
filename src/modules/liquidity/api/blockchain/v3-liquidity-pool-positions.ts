import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { withApproveApiForManyTokens, getWithWtezMintOnInputParams } from '@blockchain';
import { MIN_TICK_INDEX, QUIPUSWAP_REFERRAL_CODE } from '@config/constants';
import { TEZOS_TOKEN, WTEZ_TOKEN } from '@config/tokens';
import { calculateLiquidity, calculateTick } from '@modules/liquidity/pages/v3-item-page/helpers';
import { Tzkt } from '@shared/api';
import { getContract } from '@shared/dapp';
import {
  decreaseByPercentage,
  getFirstElement,
  getTransactionDeadline,
  isTezosToken,
  isTokenEqual
} from '@shared/helpers';
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
    const rawTicks = await Tzkt.getContractBigmapKeys<ILiquidityTickRaw>(contractAddress, 'ticks', {
      'key.lt': tickIndex.toNumber(),
      'value.next.ge': tickIndex.toNumber(),
      active: true
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
    currentPrice: BigNumber,

    minPrice: BigNumber,
    maxPrice: BigNumber,

    xTokenAmount: BigNumber,
    yTokenAmount: BigNumber
  ) => {
    const contract = await getContract(tezos, contractAddress);

    const lowerTick = calculateTick(minPrice, tickSpacing);
    const upperTick = calculateTick(maxPrice, tickSpacing);

    const deadline = await getTransactionDeadline(tezos, transactionDeadline);

    const liquidity = calculateLiquidity(
      currentTickIndex,
      lowerTick.index,
      upperTick.index,
      currentPrice,
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

    let operationsParams = [
      contract.methods
        .set_position(
          lowerTick.index,
          upperTick.index,

          lowerTickWitness, // lower_tick_witness
          upperTickWitness, // upper_tick_witness

          liquidityWithSlippage,

          deadline,

          xTokenAmount, // maximum_tokens_contributed X
          yTokenAmount, // maximum_tokens_contributed Y

          QUIPUSWAP_REFERRAL_CODE
        )
        .toTransferParams({})
    ];
    if (isTokenEqual(tokenX, TEZOS_TOKEN)) {
      operationsParams = await getWithWtezMintOnInputParams(tezos, xTokenAmount, accountPkh, operationsParams);
    }
    if (isTokenEqual(tokenY, TEZOS_TOKEN)) {
      operationsParams = await getWithWtezMintOnInputParams(tezos, yTokenAmount, accountPkh, operationsParams);
    }

    const wrappedTokenX = isTezosToken(tokenX) ? WTEZ_TOKEN : tokenX;
    const wrappedTokenY = isTezosToken(tokenY) ? WTEZ_TOKEN : tokenY;
    const tokensAmount: AmountToken[] = [
      {
        token: wrappedTokenX,
        amount: xTokenAmount // maximum_tokens_contributed X
      },
      {
        token: wrappedTokenY,
        amount: yTokenAmount // maximum_tokens_contributed Y
      }
    ];

    return await withApproveApiForManyTokens(tezos, contractAddress, tokensAmount, accountPkh, operationsParams);
  };
}
