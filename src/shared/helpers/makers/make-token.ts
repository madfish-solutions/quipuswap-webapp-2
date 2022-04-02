import { Standard, Token, TokenId } from '@shared/types';

import { shortize } from '../shortize';

export const makeToken = (tokenId: TokenId, knownTokens: Token[]) => {
  const { fa2TokenId, contractAddress, type } = tokenId;
  const matchingToken = knownTokens.find(
    ({ fa2TokenId: knownTokenId, contractAddress: knownTokenAddress }) =>
      contractAddress === knownTokenAddress && fa2TokenId === knownTokenId
  );
  const fallbackSymbol =
    type === Standard.Fa12 ? shortize(contractAddress) : `${shortize(contractAddress)}_${fa2TokenId}`;
  const fallbackToken = {
    type,
    contractAddress,
    fa2TokenId,
    isWhitelisted: false,
    metadata: {
      decimals: 0,
      symbol: fallbackSymbol,
      name: fallbackSymbol,
      thumbnailUri: ''
    }
  };

  return matchingToken ?? fallbackToken;
};
