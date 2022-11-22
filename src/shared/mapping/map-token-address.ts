import { TEZOS_TOKEN } from '@config/tokens';

import { isFa12TokenTokensValue, isFa2TokenTokensValue } from '../helpers';
import { TokenAddress, TokensValue } from '../types';

export const mapTokenAddress = (value: TokensValue): TokenAddress => {
  if (isFa2TokenTokensValue(value)) {
    return {
      contractAddress: value.fa2.token_address,
      fa2TokenId: value.fa2.token_id.toNumber()
    };
  }
  if (isFa12TokenTokensValue(value)) {
    return {
      contractAddress: value.fa12
    };
  }

  return {
    contractAddress: TEZOS_TOKEN.contractAddress
  };
};
