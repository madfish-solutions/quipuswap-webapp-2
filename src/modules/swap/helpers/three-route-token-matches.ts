import { TEZOS_TOKEN } from '@config/tokens';
import { isTokenEqual } from '@shared/helpers';
import { Token } from '@shared/types';

import { ThreeRouteStandardEnum, ThreeRouteToken } from '../types';

export const threeRouteTokenMatches = ({ standard, contract, tokenId }: ThreeRouteToken, token: Token) => {
  const threeRouteTokenAddress = {
    contractAddress: standard === ThreeRouteStandardEnum.xtz ? TEZOS_TOKEN.contractAddress : contract,
    fa2TokenId: tokenId ? Number(tokenId) : undefined
  };

  return isTokenEqual(token, threeRouteTokenAddress);
};
