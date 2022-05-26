import { BigNumber } from 'bignumber.js';

import { RoutePairWithDirection } from '../interface/route-pair-with-direction.interface';
import { Trade, TradeOperation } from '../interface/trade.interface';
import { getTradeFakeFee } from './fee.utils';
import { calculateTradeExactInput, calculateTradeExactOutput } from './trade.utils';

export const getTradeOutputOperation = (trade: Trade): TradeOperation | undefined => trade[trade.length - 1];

export const getTradeOutputAmount = (trade: Trade): BigNumber | undefined =>
  getTradeOutputOperation(trade)?.bTokenAmount;

export const getTradeInputOperation = (trade: Trade): TradeOperation | undefined => trade[0];

export const getTradeInputAmount = (trade: Trade): BigNumber | undefined => getTradeInputOperation(trade)?.aTokenAmount;

const isTradeOutputBetter = (firstTrade: Trade, secondTrade: Trade) => {
  const firstTradeOutput = getTradeOutputAmount(firstTrade);
  // @ts-ignore
  const firstTradeFakeFee = getTradeFakeFee(firstTrade);

  const secondTradeOutput = getTradeOutputAmount(secondTrade);
  // @ts-ignore
  const secondTradeFakeFee = getTradeFakeFee(secondTrade);

  if (firstTradeOutput && secondTradeOutput) {
    // TODO: take fakeFee into account
    return firstTradeOutput.isGreaterThan(secondTradeOutput);
  }

  if (firstTradeOutput) {
    return true;
  }

  return false;
};

const isTradeInputBetter = (firstTrade: Trade, secondTrade: Trade) => {
  const firstTradeInput = getTradeInputAmount(firstTrade);
  // @ts-ignore
  const firstTradeFakeFee = getTradeFakeFee(firstTrade);

  const secondTradeInput = getTradeInputAmount(secondTrade);
  // @ts-ignore
  const secondTradeFakeFee = getTradeFakeFee(secondTrade);

  if (firstTradeInput && secondTradeInput) {
    // TODO: take fakeFee into account
    return firstTradeInput.isLessThan(secondTradeInput);
  }

  if (firstTradeInput) {
    return true;
  }

  return false;
};

export const getBestTradeExactInput = (
  inputAssetAmount: BigNumber,
  routePairsCombinations: Array<RoutePairWithDirection[]>
) => {
  let bestTradeExactInput: Trade = [];

  for (const routePairs of routePairsCombinations) {
    const trade = calculateTradeExactInput(inputAssetAmount, routePairs);

    if (isTradeOutputBetter(trade, bestTradeExactInput)) {
      bestTradeExactInput = trade;
    }
  }

  return bestTradeExactInput;
};

export const getBestTradeExactOutput = (
  outputAssetAmount: BigNumber,
  routePairsCombinations: Array<RoutePairWithDirection[]>
) => {
  let bestTradeExactOutput: Trade = [];

  for (const routePairs of routePairsCombinations) {
    const trade = calculateTradeExactOutput(outputAssetAmount, routePairs);

    if (isTradeInputBetter(trade, bestTradeExactOutput)) {
      bestTradeExactOutput = trade;
    }
  }

  return bestTradeExactOutput;
};
