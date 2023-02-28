import { BigNumber } from 'bignumber.js';

import { TEZOS_TOKEN } from '@config/tokens';
import { Standard, TokenId, TokensValue } from '@shared/types';

export enum StableswapLiquidityFormTabs {
  add = 'add',
  remove = 'remove',
  create = 'create'
}

export enum StableDividendsFormTabs {
  stake = 'stake',
  unstake = 'unstake'
}

export enum StableswapVersion {
  V1 = 'V1',
  V2 = 'V2'
}

export type StableswapFormTabs = StableDividendsFormTabs | StableswapLiquidityFormTabs;

export const mapTokensValueToTokenAddress = (tokensValue: TokensValue): TokenId => {
  if ('tez' in tokensValue) {
    return TEZOS_TOKEN;
  }

  if ('fa2' in tokensValue) {
    return {
      type: Standard.Fa2,
      contractAddress: tokensValue.fa2.token_address,
      fa2TokenId: new BigNumber(tokensValue.fa2.token_address).toNumber()
    };
  }

  if ('fa12' in tokensValue) {
    return {
      type: Standard.Fa12,
      contractAddress: tokensValue.fa12
    };
  }

  throw new Error('Unknown token type: ' + JSON.stringify(tokensValue));
};
