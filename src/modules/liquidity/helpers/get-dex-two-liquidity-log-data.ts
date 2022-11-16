import { BigNumber } from 'bignumber.js';

import { LiquidityItemDto, LiquidityTokenInfoDto } from '@modules/liquidity/dto';
import { getTokenSlug } from '@shared/helpers';

export const getDexTwoLiquidityLogData = (
  tokensInfo: Array<LiquidityTokenInfoDto>,
  shares: BigNumber,
  liquiditySlippage: BigNumber,
  item: LiquidityItemDto
) => {
  const [firstTokenInfo, secondTokenInfo] = tokensInfo;

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
