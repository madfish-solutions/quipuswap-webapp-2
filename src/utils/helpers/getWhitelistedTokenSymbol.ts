import { WhitelistedToken } from '@utils/types';
import { shortize } from './shortize';

export const getWhitelistedTokenSymbol = (token:WhitelistedToken) : string => token.metadata.symbol
?? (token.metadata.name.length > 10 ? `${token.metadata.name.slice(0, 10)}...` : token.metadata.name)
?? shortize(token.contractAddress)
?? 'Token';
