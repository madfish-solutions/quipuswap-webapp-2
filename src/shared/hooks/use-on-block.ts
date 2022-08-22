import { useEffect } from 'react';

import { useSubscribeToBlock, useUnsubscribeFromBlock } from '@providers/use-dapp';

export const useOnBlock = (callback: (hash: string) => void) => {
  const subscribeToBlock = useSubscribeToBlock();
  const unsubscribeFromBlock = useUnsubscribeFromBlock();

  useEffect(() => {
    subscribeToBlock(callback);

    return () => unsubscribeFromBlock(callback);
  }, [subscribeToBlock, unsubscribeFromBlock, callback]);
};
