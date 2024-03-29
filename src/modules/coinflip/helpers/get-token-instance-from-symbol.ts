import { QUIPU_TOKEN, TEZOS_TOKEN } from '@config/tokens';

import { TokenToPlay } from '../stores';

export const getTokenInstanceFromSymbol = (tokenSymbol: TokenToPlay) => {
  if (tokenSymbol === TokenToPlay.Quipu) {
    return QUIPU_TOKEN;
  }

  return TEZOS_TOKEN;
};
