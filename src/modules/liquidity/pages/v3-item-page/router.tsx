import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { Route } from 'react-router-dom';

import { ErrorFallback, LoaderFallback, StateWrapper } from '@shared/components';
import { SentryRoutes } from '@shared/services';

import { PageNotFoundPage } from '../../../errors';
import { LiquidityTabs } from '../../liquidity-routes.enum';
import { useRouterViewModel } from './use-router.vm';
import { V3ItemPage } from './v3-item-page';

export const V3ItemPageRouter: FC = observer(() => {
  const { isLoading, isNotFound, error } = useRouterViewModel();

  if (isNotFound) {
    return <PageNotFoundPage />;
  }

  return (
    <StateWrapper
      isLoading={isLoading}
      loaderFallback={<LoaderFallback />}
      isError={!!error}
      errorFallback={<ErrorFallback error={error} />}
    >
      <SentryRoutes>
        <Route path={`${LiquidityTabs.add}/:address`} element={<V3ItemPage />} />
      </SentryRoutes>
    </StateWrapper>
  );
});
