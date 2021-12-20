import { Nullable, WhitelistedToken } from '@utils/types';

export const findToken = (
  contractToken: string,
  idToken: string,
  tokens: WhitelistedToken[]
): Nullable<WhitelistedToken> =>
  tokens.find(token => {
    if (
      idToken !== undefined &&
      token.fa2TokenId &&
      token.fa2TokenId.toString() === idToken &&
      token.contractAddress === contractToken
    ) {
      return token;
    }

    if (contractToken === token.contractAddress) {
      return token;
    }

    return null;
  }) || null;
