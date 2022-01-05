import { Nullable, WhitelistedToken } from '@utils/types';

export const findToken = (
  contractToken: string,
  idToken: string,
  tokens: WhitelistedToken[]
): Nullable<WhitelistedToken> =>
  tokens.find(token => {
    if (contractToken !== token.contractAddress) {
      return false;
    }

    if (idToken === undefined) {
      return true;
    }

    return `${token.fa2TokenId}` === idToken;
  }) || null;
