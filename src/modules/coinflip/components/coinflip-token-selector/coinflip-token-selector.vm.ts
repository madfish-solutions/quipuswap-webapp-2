import { useCoinflipStore } from '../../hooks';
import { TokenToPlay } from '../../stores';

export const useTokenSelectorViewModel = () => {
  const coinflipStore = useCoinflipStore();
  const { tokenToPlay, token } = coinflipStore;

  const handleSelectToken = (_tokenToPlay: string) => coinflipStore.setToken(_tokenToPlay as TokenToPlay);

  return { tokenToPlay, token, handleSelectToken };
};
