import { TezosToolkit } from '@taquito/taquito';
import { getPairFeeRatio, Trade } from 'swap-router-sdk';

import { isNull, toReal } from '@shared/helpers';
import { TokensMap } from '@shared/store/tokens.store';
import { Nullable } from '@shared/types';

import { swapRouterSdkTokenSlugToQuipuTokenSlug } from '../utils/swap-router-sdk-adapters';
import { getDevFeeRatio } from './get-dev-fee-ratio';

export const getUserRouteFeesAndSlug = (tezos: Nullable<TezosToolkit>, routes: Nullable<Trade>, tokens: TokensMap) => {
  if (isNull(tezos) || isNull(routes)) {
    return [];
  }

  return routes.map(route => {
    const tokenSlug = route.aTokenSlug;
    const realTokenAmount = toReal(
      route.aTokenAmount,
      tokens.get(swapRouterSdkTokenSlugToQuipuTokenSlug(tokenSlug, route.aTokenStandard))
    );
    const feeRatio = getPairFeeRatio(route);
    const devFeeRatio = getDevFeeRatio(route);
    const inputWithFee = realTokenAmount.multipliedBy(feeRatio);
    const inpuWithDevFee = realTokenAmount.multipliedBy(devFeeRatio);
    const fee = realTokenAmount.minus(inputWithFee);
    const devFee = realTokenAmount.minus(inpuWithDevFee);

    return {
      tokenSlug,
      fee,
      devFee
    };
  });
};
