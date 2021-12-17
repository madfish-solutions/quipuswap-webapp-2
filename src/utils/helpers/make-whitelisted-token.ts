import { TokenId, WhitelistedToken } from '@utils/types';

import { shortize } from './shortize';

export const makeWhitelistedToken = (tokenId: TokenId, knownTokens: WhitelistedToken[]) => {
  const { fa2TokenId, contractAddress, type } = tokenId;
  const matchingToken = knownTokens.find(
    ({ fa2TokenId: knownTokenId, contractAddress: knownTokenAddress }) =>
      contractAddress === knownTokenAddress && fa2TokenId === knownTokenId
  );
  const fallbackSymbol = type === 'fa1.2' ? shortize(contractAddress) : `${shortize(contractAddress)}_${fa2TokenId}`;
  const fallbackToken = {
    type,
    contractAddress,
    fa2TokenId,
    metadata: {
      decimals: 0,
      symbol: fallbackSymbol,
      name: fallbackSymbol,
      thumbnailUri: ''
    }
  };

  return matchingToken ?? fallbackToken;
};
