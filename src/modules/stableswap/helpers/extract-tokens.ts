import { StableswapTokensInfo } from '../types';

export const extractTokens = (tokensInfo: Array<StableswapTokensInfo>) => tokensInfo.map(({ token }) => token);
