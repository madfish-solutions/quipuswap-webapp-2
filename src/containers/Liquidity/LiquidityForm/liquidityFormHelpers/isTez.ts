import { TokenDataType } from '@utils/types';

export const isTez = (tokensData: TokenDataType) => tokensData.token.address === 'tez';
