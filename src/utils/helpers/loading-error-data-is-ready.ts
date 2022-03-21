import { LoadingErrorData } from 'stores/loading-error-data.store';

export const loadingErrorDataIsReady = <RawData, Data>(
  store: LoadingErrorData<RawData, Data>,
  shouldHaveStartedLoading = false
) => (!store.isLoading && store.isInitialized) || !shouldHaveStartedLoading;
