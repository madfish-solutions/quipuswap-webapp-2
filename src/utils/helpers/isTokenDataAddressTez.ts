import { TokenDataType } from '@utils/types';

export const isTokenDataAddressTez = (tokensData:TokenDataType) => tokensData.token.address === 'tez';
