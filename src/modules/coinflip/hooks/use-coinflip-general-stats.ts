import { useEffect, useState } from 'react';

import { DEFAULT_COINFLIP_CONTRACT } from '@config/config';
import { useRootStore } from '@providers/root-store-provider';
import { Token } from '@shared/types';
import { useToasts } from '@shared/utils';

import { getCoinflipGeneralStats } from '../api';
import { generalStatsMapping } from '../mapping';
import { useCoinflipStore } from './stores';

export const useCoinflipGeneralStats = (token: Nullable<Token>) => {
  const rootStore = useRootStore();
  const { tezos } = rootStore;
  const [isLoading, setLoading] = useState(false);
  const conflipStore = useCoinflipStore();
  const { showErrorToast } = useToasts();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        if (tezos && token) {
          const dataFromContract = await getCoinflipGeneralStats(
            tezos,
            DEFAULT_COINFLIP_CONTRACT,
            token.contractAddress
          );
          if (dataFromContract) {
            const mappedData = generalStatsMapping(dataFromContract);
            conflipStore.setGeneralStats(mappedData);
          }
        }
      } catch (error) {
        showErrorToast(error as Error);
      } finally {
        setLoading(false);
      }
    })();
  }, [conflipStore, showErrorToast, tezos, token]);

  return { isLoading };
};
