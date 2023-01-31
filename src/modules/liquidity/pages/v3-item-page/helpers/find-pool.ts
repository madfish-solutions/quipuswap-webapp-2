import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { FIRST_INDEX, OPPOSITE_INDEX } from '@config/constants';
import { DEX_V3_FACTORY_ADDRESS } from '@config/environment';
import { V3LiquidityPoolApi } from '@modules/liquidity/api';
import { getStorageInfo } from '@shared/dapp';
import { isNull } from '@shared/helpers';
import { mapTokensValue } from '@shared/mapping/map-token-value';
import { Nullable, Token } from '@shared/types';

export const findPool = async (tezos: Nullable<TezosToolkit>, feeRate: BigNumber, tokens: Array<Token>) => {
  if (isNull(tezos)) {
    return;
  }

  const dexFactory = await getStorageInfo<V3LiquidityPoolApi.V3FactoryStorage>(tezos, DEX_V3_FACTORY_ADDRESS);

  return await dexFactory.pool_ids.get({
    fee_bps: feeRate,
    token_x: mapTokensValue(tokens[FIRST_INDEX]),
    token_y: mapTokensValue(tokens[OPPOSITE_INDEX])
  });
};
