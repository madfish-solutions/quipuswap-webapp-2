import { FC } from 'react';

import { Route } from 'react-router-dom';

import { StateWrapper } from '@shared/components';
import { SentryRoutes } from '@shared/services';

import { TokensListPage } from './pages/tokens-list';
import { useTokensRouterViewModel } from './tokens-router.vm';

export const TokensRouter: FC = () => {
  const { isInitialized, error } = useTokensRouterViewModel();

  return (
    <StateWrapper
      isLoading={!isInitialized}
      loaderFallback={<div>Loading...</div>}
      isError={!!error}
      errorFallback={<div>Error: {error}</div>}
    >
      <SentryRoutes>
        <Route path="/" element={<TokensListPage />} />
      </SentryRoutes>
    </StateWrapper>
  );
};
