import { useAmplitudeService } from '@shared/hooks';

import { useCoinflipStore } from '../../hooks';
import { TokenToPlay } from '../../stores';

export const useTokenSelectorViewModel = () => {
  const coinflipStore = useCoinflipStore();

  const { log } = useAmplitudeService();

  const { tokenToPlay, token } = coinflipStore;

  const handleSelectToken = (_tokenToPlay: string) => {
    coinflipStore.setToken(_tokenToPlay as TokenToPlay);

    if (tokenToPlay !== _tokenToPlay) {
      log('CLICK_FLIP_TOKEN_SELECT', {
        asset: _tokenToPlay
      });
    }
  };

  return { tokenToPlay, token, handleSelectToken };
};
