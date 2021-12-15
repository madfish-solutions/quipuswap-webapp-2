import { Dispatch, SetStateAction } from 'react';

import { Nullable, WhitelistedToken } from '@utils/types';

export interface AddRemoveFormInterface {
  tokenA: WhitelistedToken;
  tokenB: WhitelistedToken;
  setTokenA: Dispatch<SetStateAction<Nullable<WhitelistedToken>>>;
  setTokenB: Dispatch<SetStateAction<Nullable<WhitelistedToken>>>;
}
