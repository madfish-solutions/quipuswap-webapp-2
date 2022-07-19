import { amplitudeService } from '@shared/services';

import { useCoinflipStore } from '../../hooks';
import { TokenToPlay } from '../../stores';

export const useTokenSelectorViewModel = () => {
  const coinflipStore = useCoinflipStore();
  const { tokenToPlay, token } = coinflipStore;

  const handleSelectToken = (_tokenToPlay: string) => {
    coinflipStore.setToken(_tokenToPlay as TokenToPlay);

    if (tokenToPlay !== _tokenToPlay) {
      amplitudeService.logEvent('ASSET_SELECTED', {
        asset: _tokenToPlay
      });
    }
  };

  return { tokenToPlay, token, handleSelectToken };
};
