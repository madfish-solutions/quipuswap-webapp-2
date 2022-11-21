import { BigNumber } from 'bignumber.js';

import { getTokenSlug } from '@shared/helpers';

import { LiquidityItem } from '../interfaces';

export const makeLiquidityOperationLogData = (shares: BigNumber, liquiditySlippage: BigNumber, item: LiquidityItem) => {
  const [firstTokenInfo, secondTokenInfo] = item.tokensInfo;

  return {
    firstTokenSlug: getTokenSlug(firstTokenInfo.token),
    secondTokenSlug: getTokenSlug(secondTokenInfo.token),
    firstTokenName: firstTokenInfo.token.metadata.name,
    secondTokenName: secondTokenInfo.token.metadata.name,
    liquidityLp: shares.toNumber(),
    slippage: liquiditySlippage.toNumber(),
    tvlUsd: item.tvlInUsd.toNumber(),
    totalSupply: item.totalSupply.toNumber(),
    poolType: item.type
  };
};
