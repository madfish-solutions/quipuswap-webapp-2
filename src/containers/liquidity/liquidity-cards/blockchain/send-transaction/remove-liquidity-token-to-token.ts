import { FoundDex } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { LP_TOKEN_DECIMALS, SECONDS_IN_MINUTE } from '@app.config';
import { decreaseBySlippage } from '@containers/liquidity/liquidity-cards/helpers';
import { getOrderedTokensAmounts } from '@containers/liquidity/liquidity-cards/helpers/get-ordered-tokens-amounts';
import { getBlockchainTimestamp, toDecimals } from '@utils/helpers';
import { WhitelistedToken } from '@utils/types';

export const removeLiquidityTokenToToken = async (
  tezos: TezosToolkit,
  dex: FoundDex,
  id: BigNumber,
  lpTokenInput: string,
  tokenAOutput: string,
  tokenBOutput: string,
  tokenA: WhitelistedToken,
  tokenB: WhitelistedToken,
  transactionDuration: BigNumber,
  slippagePercentage: BigNumber
) => {
  const transactionDurationInSeconds = transactionDuration
    .multipliedBy(SECONDS_IN_MINUTE)
    .integerValue(BigNumber.ROUND_DOWN)
    .toNumber();
  const transactionDeadline = (await getBlockchainTimestamp(tezos, transactionDurationInSeconds)).toString();

  const { decimals: decimalsA } = tokenA.metadata;
  const { decimals: decimalsB } = tokenB.metadata;

  const lpTokenBN = new BigNumber(lpTokenInput);
  const tokenAOutputBN = new BigNumber(tokenAOutput);
  const tokenBOutputBN = new BigNumber(tokenBOutput);

  const shares = toDecimals(lpTokenBN, LP_TOKEN_DECIMALS).integerValue(BigNumber.ROUND_UP);
  const tokenAOutputAmount = toDecimals(tokenAOutputBN, decimalsA);
  const tokenBOutputAmount = toDecimals(tokenBOutputBN, decimalsB);

  const withSlippageA = decreaseBySlippage(tokenAOutputAmount, slippagePercentage).integerValue(BigNumber.ROUND_DOWN);
  const withSlippageB = decreaseBySlippage(tokenBOutputAmount, slippagePercentage).integerValue(BigNumber.ROUND_DOWN);

  const { orderedAmountA, orderedAmountB } = getOrderedTokensAmounts(tokenA, tokenB, withSlippageA, withSlippageB);

  return dex.contract.methods.divest(id, orderedAmountA, orderedAmountB, shares, transactionDeadline).send();
};
