import { SAVED_TOKENS_KEY } from '@config/localstorage';
import { isTokenEqual } from '@shared/helpers';
import { TokenWithQSNetworkType } from '@shared/types';

import { getSavedTokensApi } from './get-saved-tokens.api';

export const saveCustomTokenApi = (token: TokenWithQSNetworkType) => {
  window.localStorage.setItem(
    SAVED_TOKENS_KEY,
    JSON.stringify([token, ...getSavedTokensApi().filter((x: TokenWithQSNetworkType) => !isTokenEqual(x, token))])
  );
};
