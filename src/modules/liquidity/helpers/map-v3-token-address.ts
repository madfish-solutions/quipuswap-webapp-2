import { TEZOS_TOKEN, WTEZ_TOKEN } from '@config/tokens';
import { isFa12TokenTokensValue, isFa2TokenTokensValue, isTokenEqual } from '@shared/helpers';
import { Standard, TokenAddress, TokensValue } from '@shared/types';

export const mapV3TokenAddress = (value: TokensValue): TokenAddress => {
  if (isFa2TokenTokensValue(value)) {
    const inputTokenId = {
      contractAddress: value.fa2.token_address,
      fa2TokenId: value.fa2.token_id.toNumber(),
      type: Standard.Fa2
    };

    if (isTokenEqual(inputTokenId, WTEZ_TOKEN)) {
      return TEZOS_TOKEN;
    }

    return inputTokenId;
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
