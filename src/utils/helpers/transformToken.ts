import { WhitelistedToken } from '@utils/types';

export const transformToken = ({
  contractAddress,
  decimals,
  name,
  symbol,
  thumbnailUri,
  fa2TokenId,
}:{
  contractAddress:string,
  decimals:number,
  name:string,
  symbol:string,
  thumbnailUri:string
  fa2TokenId?:string
}):WhitelistedToken => {
  const result:WhitelistedToken = {
    contractAddress,
    fa2TokenId: fa2TokenId ? +fa2TokenId : undefined,
    metadata: {
      symbol,
      name,
      thumbnailUri,
      decimals,
    },
    type: fa2TokenId ? 'fa2' : 'fa1.2',
  };

  return result;
};
