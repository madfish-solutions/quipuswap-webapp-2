import { QSNetwork, WhitelistedToken } from '@utils/types';

export type WhitelistedOrCustomToken = WhitelistedToken & { network: string };

export const localSearchToken = (
  { metadata, contractAddress, fa2TokenId, network: tokenNetwork }: WhitelistedOrCustomToken,
  network: QSNetwork,
  oldInput: string,
  oldInputToken: number
) => {
  const isName = metadata?.name?.toLowerCase().includes(oldInput.toLowerCase());
  const isSymbol = metadata?.symbol?.toLowerCase().includes(oldInput.toLowerCase());
  const isContract = contractAddress.toLowerCase().includes(oldInput.toLowerCase());
  const fa2TokenIdMatches = fa2TokenId === undefined || fa2TokenId === oldInputToken;
  const networkIdMatches = !tokenNetwork || tokenNetwork === network.id;

  return networkIdMatches && (isName || isSymbol || (isContract && fa2TokenIdMatches));
};
