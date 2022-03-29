import { createContext, ReactNode, useContext } from 'react';

import { RootStore } from '@shared/store';
import { Undefined } from '@shared/types/types';

let store: RootStore;

const StoreContext = createContext<Undefined<RootStore>>(undefined);
StoreContext.displayName = 'RootStoreContext';

export const useRootStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useRootStore must be used within RootStoreProvider');
  }

  return context;
};

const initializeStore = (): RootStore => {
  const _store = store ?? new RootStore();

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') {
    return _store;
  }
  // Create the store once in the client
  if (!store) {
    store = _store;
  }

  return _store;
};

export const RootStoreProvider = ({ children }: { children: ReactNode }) => {
  const store = initializeStore();
  // eslint-disable-next-line no-console
  console.log('RootStoreProvider', children);

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};
