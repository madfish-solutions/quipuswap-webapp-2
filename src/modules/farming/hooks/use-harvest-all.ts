import { CoinSide, TokenToPlay } from '@modules/coinflip';
import { useCoinflipStore } from '@modules/coinflip/hooks';
import { useAmplitudeService } from '@shared/hooks';
import { Nullable } from '@shared/types';

import { useDoHarvestAll } from './blockchain';
import { useHarvestAndRollStore } from './stores';

export const useHarvestAll = () => {
  const harvestAndRollStore = useHarvestAndRollStore();
  const { doHarvestAll } = useDoHarvestAll();
  const coinflipStore = useCoinflipStore();
  const { log } = useAmplitudeService();

  const onCoinSideSelect = (_coinSide: Nullable<CoinSide>) => {
    harvestAndRollStore.setCoinSide(harvestAndRollStore.coinSide === _coinSide ? null : _coinSide);
    harvestAndRollStore.setCoinSideError(null);
  };

  const onClose = () => {
    onCoinSideSelect(null);
    harvestAndRollStore.close();
  };

  const harvestAll = async (modalWasShown: boolean) => {
    harvestAndRollStore.startHarvestLoading();
    coinflipStore.setPendingGameTokenToPlay(TokenToPlay.Quipu);
    if (modalWasShown) {
      log('HARVEST_AND_ROLL_HARVEST_ALL_CLICK');
    }

    await doHarvestAll();
    if (modalWasShown) {
      log('HARVEST_AND_ROLL_HARVEST_ALL_SUCCESS');
    }
    harvestAndRollStore.finishHarvestLoading();
    onClose();
  };

  return {
    onCoinSideSelect,
    onClose,
    harvestAll
  };
};
