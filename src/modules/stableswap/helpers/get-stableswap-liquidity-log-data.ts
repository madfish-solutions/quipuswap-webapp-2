import BigNumber from 'bignumber.js';

import { ZERO_AMOUNT } from '@config/constants';
import { getTokenSlug } from '@shared/helpers';

import { StableswapItem, StableswapTokensInfo } from '../types';

export const getStableswapLiquidityLogData = (
  tokensInfo: StableswapTokensInfo[],
  inputAmounts: Array<Nullable<BigNumber>>,
  shares: BigNumber,
  liquiditySlippage: BigNumber,
  item: StableswapItem
) => {
  const [token1Info, token2Info, token3Info, token4Info] = tokensInfo;

  return {
    asset1: getTokenSlug(token1Info.token),
    asset2: getTokenSlug(token2Info.token),
    asset3: token3Info && getTokenSlug(token3Info.token),
    asset4: token4Info && getTokenSlug(token4Info.token),
    liquidityUsd: inputAmounts
      .reduce<BigNumber>(
        (sum, inputAmount, index) => sum.plus(inputAmount?.times(tokensInfo[index].exchangeRate) ?? ZERO_AMOUNT),
        new BigNumber(ZERO_AMOUNT)
      )
      .toNumber(),
    liquidityLp: shares.toNumber(),
    slippage: liquiditySlippage.toNumber(),
    tvlUsd: tokensInfo
      .reduce((sum, tokenInfo) => sum.plus(tokenInfo.reservesInUsd), new BigNumber(ZERO_AMOUNT))
      .toNumber(),
    totalLpSupply: item.totalLpSupply.toNumber()
  };
};
