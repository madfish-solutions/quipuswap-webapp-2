import { TokenDataType } from '@utils/types';

import { isTokenDataAddressTez } from './isTokenDataAddressTez';

export const transformTokenDataToAsset = (token: TokenDataType) =>
  isTokenDataAddressTez(token)
    ? 'tez'
    : {
        contract: token.token.address,
        id: token.token.id ?? undefined
      };
