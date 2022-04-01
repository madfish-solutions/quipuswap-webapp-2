import { QSNets, QSNetwork, TokenWithQSNetworkType } from '@shared/types';

import { isExist } from '../type-checks';

export interface TokenWithRequiredNetwork extends TokenWithQSNetworkType {
  network: QSNets;
}

export const localSearchToken = (
  { metadata, contractAddress, fa2TokenId, network: tokenNetwork }: TokenWithRequiredNetwork,
  network: QSNetwork,
  oldInput: string,
  oldInputToken: number
) => {
  const isName = metadata?.name?.toLowerCase().includes(oldInput.toLowerCase());
  const isSymbol =
    metadata?.symbol?.toLowerCase().includes(oldInput.toLowerCase()) && metadata?.symbol !== contractAddress;
  const isContract = contractAddress.toLowerCase().includes(oldInput.toLowerCase());
  const fa2TokenIdMatches =
    ((!isExist(oldInputToken) || oldInputToken === 0) && fa2TokenId === undefined) || fa2TokenId === oldInputToken;
  const networkIdMatches = !tokenNetwork || tokenNetwork === network.id;

  return networkIdMatches && (isName || isSymbol || (isContract && fa2TokenIdMatches));
};
