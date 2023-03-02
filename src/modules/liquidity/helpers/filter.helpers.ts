import { BigNumber } from 'bignumber.js';

import { getTokenSlug, isExist } from '@shared/helpers';
import { Nullable, Token } from '@shared/types';

import { PoolType, PoolTypeOptionEnum } from '../interfaces';
import { LiquidityItemModel } from '../models';

const poolTypesByOptions = {
  [PoolTypeOptionEnum.ALL]: [
    PoolType.TEZ_TOKEN,
    PoolType.TOKEN_TOKEN,
    PoolType.DEX_TWO,
    PoolType.UNISWAP,
    PoolType.STABLESWAP
  ],
  [PoolTypeOptionEnum.V1]: [PoolType.TOKEN_TOKEN, PoolType.TEZ_TOKEN],
  [PoolTypeOptionEnum.V2]: [PoolType.DEX_TWO],
  [PoolTypeOptionEnum.V3]: [PoolType.UNISWAP],
  [PoolTypeOptionEnum.STABLESWAP]: [PoolType.STABLESWAP]
};

export const filterByPoolType =
  (poolTypeOption: PoolTypeOptionEnum) =>
  ({ item }: LiquidityItemModel) =>
    poolTypesByOptions[poolTypeOption].includes(item.type);

export const filterByDust =
  (showDust: boolean, dustThreshold: BigNumber) =>
  ({ item }: LiquidityItemModel) =>
    showDust ? true : item.tvlInUsd.gt(dustThreshold);

export const filterByTokens =
  (filterTokens: Nullable<Array<Token>>) =>
  ({ tokens }: LiquidityItemModel) => {
    if (!filterTokens || !filterTokens.length) {
      return true;
    }

    const dexTokens = tokens.filter(isExist).map(getTokenSlug);

    return filterTokens.map(getTokenSlug).every(token => dexTokens.includes(token));
  };
