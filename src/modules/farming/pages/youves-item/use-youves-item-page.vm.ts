import { QUIPU_TOKEN, TEZOS_TOKEN } from '@config/tokens';
import { getTokensNames } from '@shared/helpers';

export const useYouvesItemPageViewModel = () => {
  const getTitle = () => {
    return `Farming ${getTokensNames([QUIPU_TOKEN, TEZOS_TOKEN])}`;
  };

  return { getTitle };
};
