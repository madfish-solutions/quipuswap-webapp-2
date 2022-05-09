import { useCoinflipStore } from '../../hooks';
import { TokenToPlay } from '../../stores';

export const useTokenSelectorViewModel = () => {
  const coinflipStore = useCoinflipStore();
  const { tokenToPlay, token } = coinflipStore;

  const handleSelectToken = (_tokenToPlay: TokenToPlay) => coinflipStore.setToken(_tokenToPlay);

  return { tokenToPlay, token, handleSelectToken };
};
