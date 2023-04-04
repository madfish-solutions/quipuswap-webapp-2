import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { FIRST_INDEX, OPPOSITE_INDEX } from '@config/constants';
import { DEX_V3_FACTORY_ADDRESS } from '@config/environment';
import { WTEZ_TOKEN } from '@config/tokens';
import { V3LiquidityPoolApi } from '@modules/liquidity/api';
import { getStorageInfo } from '@shared/dapp';
import { isNull, isTezosToken } from '@shared/helpers';
import { mapTokensValue } from '@shared/mapping/map-token-value';
import { Nullable, Token } from '@shared/types';

export const findPool = async (tezos: Nullable<TezosToolkit>, feeRate: BigNumber, tokens: Array<Token>) => {
  if (isNull(tezos)) {
    return;
  }

  const dexFactory = await getStorageInfo<V3LiquidityPoolApi.V3FactoryStorage>(tezos, DEX_V3_FACTORY_ADDRESS);
  const wrappedTokenX = isTezosToken(tokens[FIRST_INDEX]) ? WTEZ_TOKEN : tokens[FIRST_INDEX];
  const wrappedTokenY = isTezosToken(tokens[OPPOSITE_INDEX]) ? WTEZ_TOKEN : tokens[OPPOSITE_INDEX];

  return await dexFactory.pool_ids.get({
    fee_bps: feeRate,
    token_x: mapTokensValue(wrappedTokenX),
    token_y: mapTokensValue(wrappedTokenY)
  });
};
