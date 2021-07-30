import { WhitelistedToken } from '@utils/types';
import { shortize } from './shortize';

export const getWhitelistedTokenName = (token:WhitelistedToken) : string => (
  token.metadata.name.length > 10 ? `${token.metadata.name.slice(0, 10)}...` : token.metadata.name
)
?? token.metadata.symbol
?? shortize(token.contractAddress)
?? 'Token';
