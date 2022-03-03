import { TEZOS_TOKEN_SLUG } from '@app.config';
import { TokenDataType } from '@utils/types';

import { isTokenDataAddressTez } from './isTokenDataAddressTez';

export const transformTokenDataToAsset = (token: TokenDataType) =>
  isTokenDataAddressTez(token)
    ? TEZOS_TOKEN_SLUG
    : {
        contract: token.token.address,
        id: token.token.id ?? undefined
      };
