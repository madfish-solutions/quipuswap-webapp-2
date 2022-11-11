import { BigNumber } from 'bignumber.js';

import { getTokenSlug, isExist } from '@shared/helpers';
import { Nullable, Token } from '@shared/types';

import { Categories } from '../interfaces';
import { LiquidityItemModel } from '../models';

const filterByCategory =
  (enable: boolean, category: Categories) =>
  ({ item }: LiquidityItemModel) =>
    enable ? item.poolLabels.includes(category) : true;

export const filterByStableSwap = (showStable: boolean) => filterByCategory(showStable, Categories.Stable);
export const filterByBridget = (showBridged: boolean) => filterByCategory(showBridged, Categories.Bridge);
export const filterByQuipu = (showQuipu: boolean) => filterByCategory(showQuipu, Categories.QuipuSwap);
export const filterByTezotopia = (showTezotopia: boolean) => filterByCategory(showTezotopia, Categories.Tezotopia);
export const filterByBTC = (showBTC: boolean) => filterByCategory(showBTC, Categories.BTC);
// TODO Tezotopia -> DexTwo
export const filterByDexTwo = (showDexTwo: boolean) => filterByCategory(showDexTwo, Categories.Tezotopia);

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
