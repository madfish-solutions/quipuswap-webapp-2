import { RPC_URLS } from '@config/environment';
import { PREFERRED_RPC_URL } from '@config/localstorage';

import { getFirstElement } from '../arrays';

export function getPreferredRpcUrl() {
  const lastUsedRpcUrl = localStorage.getItem(PREFERRED_RPC_URL);
  if (lastUsedRpcUrl) {
    return lastUsedRpcUrl;
  }

  return getFirstElement(RPC_URLS);
}
