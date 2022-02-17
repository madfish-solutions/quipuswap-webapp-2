import { TokenDataType } from '@interfaces/types';

export const isTokenDataAddressTez = (tokensData: TokenDataType) => tokensData.token.address === 'tez';
