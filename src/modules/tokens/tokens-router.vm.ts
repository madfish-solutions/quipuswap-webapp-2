import { useEffect, useState } from 'react';

import { useRootStore } from '@providers/root-store-provider';
import { isNull } from '@shared/helpers';

export const useTokensRouterViewModel = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Nullable<string>>(null);
  const rootStore = useRootStore();

  useEffect(() => {
    (async () => {
      try {
        if (
          isNull(rootStore.tokensStore) ||
          isNull(rootStore.tokensBalancesStore) ||
          isNull(rootStore.tokensManagerStore) ||
          isNull(rootStore.tokensModalStore)
        ) {
          throw new Error('Where is my store?!');
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('page.error', e);
        setError((e as Error).message);
      } finally {
        setIsInitialized(true);
      }
    })();
  }, [rootStore]);

  return { isInitialized, error };
};
