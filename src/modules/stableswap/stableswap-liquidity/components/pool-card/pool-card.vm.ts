import { DEFAULT_TOKEN, TEZOS_TOKEN } from '@config/tokens';
import { Token } from '@shared/types';

export const usePoolCardViewModel = () => {
  const tokens = [DEFAULT_TOKEN, TEZOS_TOKEN, DEFAULT_TOKEN, TEZOS_TOKEN];

  const preparelogos = (tokens_: Array<Token>) =>
    tokens_.map(({ metadata: { symbol, thumbnailUri } }) => ({ tokenIcon: thumbnailUri, tokenSymbol: symbol }));

  return {
    tokens,
    preparelogos
  };
};
